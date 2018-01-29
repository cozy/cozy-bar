import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import Autosuggest from 'react-autosuggest'
import { fetchRawIntent } from '../lib/intents'

const INTENT_VERB = 'OPEN'
const INTENT_DOCTYPE = 'io.cozy.suggestions'
const SUGGESTIONS_PER_SOURCE = 10

const normalizeString = str => str.toString().toLowerCase().replace(/\//g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')

const highlightQueryTerms = (searchResult, query) => {
  const normalizedQueryTerms = normalizeString(query)
  const normalizedResultTerms = normalizeString(searchResult)

  const matchedIntervals = []
  const spacerLength = 1
  let currentIndex = 0

  normalizedResultTerms.forEach(resultTerm => {
    normalizedQueryTerms.forEach(queryTerm => {
      const index = resultTerm.indexOf(queryTerm)
      if (index >= 0) {
        matchedIntervals.push({
          from: currentIndex + index,
          to: currentIndex + index + queryTerm.length
        })
      }
    })

    currentIndex += resultTerm.length + spacerLength
  })

  // matchedIntervals can overlap, so we merge them.
  // - sort the intervals by starting index
  // - add the first interval to the stack
  // - for every interval,
  // - - add it to the stack if it doesn't overlap with the stack top
  // - - or extend the stack top if the start overlaps and the new interval's top is bigger
  const mergedIntervals = matchedIntervals.sort((intervalA, intervalB) => intervalA.from > intervalB.from).reduce((computedIntervals, newInterval) => {
    if (computedIntervals.length === 0 || computedIntervals[computedIntervals.length - 1].to < newInterval.from) {
      computedIntervals.push(newInterval)
    } else if (computedIntervals[computedIntervals.length - 1].to < newInterval.to) {
      computedIntervals[computedIntervals.length - 1].to = newInterval.to
    }

    return computedIntervals
  }, [])

  // create an array containing the entire search result, with special characters, and the intervals surrounded y `<b>` tags
  const slicedOriginalResult = mergedIntervals.length > 0 ? [searchResult.slice(0, mergedIntervals[0].from)] : searchResult

  for (let i = 0, l = mergedIntervals.length; i < l; ++i) {
    slicedOriginalResult.push((<b>{searchResult.slice(mergedIntervals[i].from, mergedIntervals[i].to)}</b>))
    if (i + 1 < l) slicedOriginalResult.push(searchResult.slice(mergedIntervals[i].to, mergedIntervals[i + 1].from))
  }

  if (mergedIntervals.length > 0) slicedOriginalResult.push(searchResult.slice(mergedIntervals[mergedIntervals.length - 1].to, searchResult.length))

  return slicedOriginalResult
}

class SearchBar extends Component {
  state = {
    query: '',
    isInitialSearch: true,
    searching: false,
    focused: false,
    suggestionsBySource: [],
    sourceURLs: []
  }

  sources = []

  componentDidMount () {
    // The searchbar has one or more sources that provide suggestions. These sources are iframes into other apps, provied by thee intent system.
    // Since we need to call the sources whenever the query changes, we are taking manual control over the intent process.
    fetchRawIntent(INTENT_VERB, INTENT_DOCTYPE)
      .then(intent => {
        const { services } = intent.attributes
        if (!services) return null

        this.sources = services.map(service => {
          const url = service.href
          this.setState(state => ({...state, sourceURLs: [...state.sourceURLs, url]}))
          const serviceOrigin = url.split('/', 3).join('/')

          return {
            slug: service.slug, // can be used to show where a suggestion comes from
            origin: serviceOrigin,
            id: intent._id,
            ready: false,
            window: null, // will hold a reference to the window we're sending messages to
            resolve: null // a reference to a function to call when the source sends suggestions
          }
        })

        window.addEventListener('message', this.onMessageFromSource(this.sources))
      })
  }

  onMessageFromSource = (sources) => (event) => {
    // this re-implements a subset of injectService found in lib/intents, though only the part that are useful for suggestions
    const source = sources.find(source => source.origin === event.origin)

    if (!source) return null

    if (event.data.type === `intent-${source.id}:ready`) {
      source.ready = true
      source.window = event.source

      source.window.postMessage({}, event.origin)
    } else if (event.data.type === `intent-${source.id}:data` && source.resolve) {
      source.resolve({
        id: source.id,
        suggestions: event.data.suggestions
      })
      source.resolve = null
    } else {
      console.log('unhandled message:', event)
    }
  }

  onChange = (event, { newValue }) => {
    this.setState({
      query: newValue
    })
  }

  changeFocusState = (focused) => {
    this.setState({
      focused
    })
  }

  clearSuggestions = () => {
    this.setState({
      suggestionsBySource: []
    })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    const availableSources = this.sources.filter(source => source.ready)

    if (availableSources.length > 0) {
      this.setState(state => ({ ...state, searching: true }))

      availableSources.forEach(async (source) => {
        const {id, suggestions} = await new Promise(resolve => {
          source.resolve = resolve
          source.window.postMessage({ query: value }, source.origin)
        })
        const title = this.sources.find(source => source.id === id).slug
        if (this.state.searching) {
          this.setState(state => ({
            ...state,
            searching: false,
            isInitialSearch: false,
            suggestionsBySource: [
              {title, suggestions}
            ]
          }))
        } else {
          this.setState(state => ({
            ...state,
            suggestionsBySource: [
              ...state.suggestionsBySource,
              {title, suggestions}
            ]
          }))
        }
      })
    }
  }

  onSuggestionsClearRequested = () => {
    this.clearSuggestions()
    this.setState({ isInitialSearch: true, searching: false })
  }

  onSuggestionSelected = (event, { suggestion }) => {
    const { onSelect } = suggestion
    // `onSelect` is a string that describes what should happen when the suggestion is selected. Currently, the only format we're supporting is `open:http://example.com` to change the url of the current page.

    if (/^open:/.test(onSelect)) {
      const url = onSelect.substr(5)
      window.location.href = url
    } else {
      console.log('suggestion onSelect (' + onSelect + ') could not be executed')
    }

    this.setState({ query: '' })
  }

  getSectionSuggestions = (section) => section.suggestions.slice(0, SUGGESTIONS_PER_SOURCE)

  getSuggestionValue = (suggestion) => suggestion.term || suggestion.title

  renderSectionTitle = (section) => null // we only have one section at the moment, but if we decide to sort suggestions by section/source, we can use this callback

  renderSuggestion = (suggestion) => (
    <div className='coz-searchbar-autosuggest-suggestion-content'>
      {suggestion.icon && <img className='coz-searchbar-autosuggest-suggestion-icon' src={suggestion.icon} alt='icon' />}
      <div className='coz-searchbar-autosuggest-suggestion-title'>
        {highlightQueryTerms(suggestion.title, this.state.query)}
      </div>
      {
        suggestion.subtitle &&
        <div className='coz-searchbar-autosuggest-suggestion-subtitle'>
          {highlightQueryTerms(suggestion.subtitle, this.state.query)}
        </div>
      }
    </div>
  )

  render () {
    const { query, isInitialSearch, searching, focused, suggestionsBySource, sourceURLs } = this.state
    const { t } = this.props

    const hasSuggestions = suggestionsBySource.reduce((totalSuggestions, suggestionSection) => (totalSuggestions + suggestionSection.suggestions.length), 0) > 0

    const inputProps = {
      placeholder: t('searchbar.placeholder'),
      value: query,
      onChange: this.onChange,
      onFocus: () => this.changeFocusState(true),
      onBlur: () => this.changeFocusState(false)
    }

    const theme = {
      container: 'coz-searchbar-autosuggest-container' + (searching ? ' --searching' : ''),
      input: 'coz-searchbar-autosuggest-input',
      inputFocused: 'coz-searchbar-autosuggest-input-focused',
      suggestionsContainer: 'coz-searchbar-autosuggest-suggestions-container',
      suggestionsContainerOpen: 'coz-searchbar-autosuggest-suggestions-container--open',
      suggestionsList: 'coz-searchbar-autosuggest-suggestions-list',
      suggestion: 'coz-searchbar-autosuggest-suggestion',
      suggestionHighlighted: 'coz-searchbar-autosuggest-suggestion-highlighted',
      sectionTitle: 'coz-searchbar-autosuggest-section-title'
    }
    return (
      <div className='coz-searchbar'>
        {sourceURLs.map(url => (
          <iframe src={url} style={{display: 'none'}} />
        ))}
        <Autosuggest
          theme={theme}
          suggestions={suggestionsBySource}
          multiSection
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={this.getSuggestionValue}
          getSectionSuggestions={this.getSectionSuggestions}
          renderSectionTitle={this.renderSectionTitle}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          focusInputOnSuggestionClick={false}
        />
        { query !== '' && !isInitialSearch && focused && !hasSuggestions &&
          <div className={'coz-searchbar-autosuggest-status-container'}>
            {t('searchbar.empty', { query })}
          </div>
        }
      </div>
    )
  }
}

export default translate()(SearchBar)
