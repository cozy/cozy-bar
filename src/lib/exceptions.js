class UnavailableStackException extends Error {
  constructor (message) {
    super()

    this.name = 'UnavailableStack'
    this.message = message || 'The stack is temporarily unavailable'
    this.stack = (new Error()).stack
  }
}

class UnauthorizedStackException extends Error {
  constructor (message) {
    super()

    this.name = 'UnauthorizedStack'
    this.message = message || 'The app is not allowed to access to the requested resource'
    this.stack = (new Error()).stack
  }
}

class UnavailableSettingsException extends Error {
  constructor (message) {
    super()

    this.name = 'UnavailableSettings'
    this.message = message || "The 'Settings' application isn't available or installed in the stack"
    this.stack = (new Error()).stack
  }
}

export {
  UnavailableStackException,
  UnavailableSettingsException,
  UnauthorizedStackException
}
