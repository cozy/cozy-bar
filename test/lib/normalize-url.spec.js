import normalizeUrl from 'lib/normalize-url'

let old_window ;

const https_url = "https://test.mycozy.cloud/path/with?parameters=1"
const http_url = "http://test.mycozy.cloud/path/with?parameters=1"
const https_origin = "https://test.mycozy.cloud"
const http_origin = "http://test.mycozy.cloud"
const domain = "test.mycozy.cloud"
const https_app = "https://test-app.mycozy.cloud/path/with?parameters=1"
const http_app = "http://test-app.mycozy.cloud/path/with?parameters=1"

describe('URL normalization', () => {

  beforeAll(() => {
    old_window = global.window
    global.window = Object.create(window);
    delete global.window.location
  })

  beforeEach(() => {
    global.window.location = undefined
  })

  afterAll(() => {
    global.window = old_window
    old_window = undefined
  })

  it('should accept a domain name with a secure parameter', () => {
    expect( normalizeUrl(domain, true).origin ).toBe(https_origin)
  })

  it('default protocol should be the one of window.location', () => {
    window.location = new URL(https_app)
    expect( normalizeUrl(domain, undefined).origin ).toBe(https_origin)
    window.location = new URL(http_app)
    expect( normalizeUrl(domain, undefined).origin ).toBe(http_origin)
  })

  it('should accept a complete origin', () => {
    expect( normalizeUrl(https_origin, undefined).origin ).toBe(https_origin)
  })

  it('should accept an unsecure protocol', () => {
    expect( normalizeUrl(http_origin, undefined).origin ).toBe(http_origin)
  })

  it('should be able to override the protocol', () => {
    expect( normalizeUrl(http_origin, true).origin ).toBe(https_origin)
    expect( normalizeUrl(https_origin, false).origin ).toBe(http_origin)
  })

  it('should accept a full URL', () => {
    expect( normalizeUrl(http_url, undefined).origin ).toBe(http_origin)
  })

})
