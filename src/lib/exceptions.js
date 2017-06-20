class ForbiddenException extends Error {
  constructor (message) {
    super()

    this.name = 'Forbidden'
    this.message = message || 'The application does not have permission to access this resource.'
    this.stack = (new Error()).stack
  }
}

class ServerErrorException extends Error {
  constructor (message) {
    super()

    this.name = 'ServerError'
    this.message = message || 'A server error occurred'
    this.stack = (new Error()).stack
  }
}

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
  ForbiddenException,
  ServerErrorException,
  UnavailableStackException,
  UnavailableSettingsException,
  UnauthorizedStackException
}
