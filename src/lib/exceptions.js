class ForbiddenException extends Error {
  constructor (message) {
    super()

    this.name = 'Forbidden'
    this.status = 403
    this.message = message || 'The application does not have permission to access this resource.'
    this.stack = (new Error()).stack
  }
}

class ServerErrorException extends Error {
  constructor (message) {
    super()

    this.name = 'ServerError'
    this.status = 500
    this.message = message || 'A server error occurred'
    this.stack = (new Error()).stack
  }
}

class NotFoundException extends Error {
  constructor (message) {
    super()

    this.name = 'NotFound'
    this.status = 404
    this.message = message || 'The ressource was not found'
    this.stack = (new Error()).stack
  }
}

class MethodNotAllowedException extends Error {
  constructor (message) {
    super()

    this.name = 'MethodNotAllowed'
    this.status = 405
    this.message = message || 'Method not allowed'
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
    this.status = 401
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
  NotFoundException,
  MethodNotAllowedException,
  UnavailableStackException,
  UnavailableSettingsException,
  UnauthorizedStackException
}
