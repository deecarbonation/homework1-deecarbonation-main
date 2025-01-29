export class EOFError extends Error {
    constructor(message : string) {
      super(message);
      Object.setPrototypeOf(this, EOFError.prototype);
      this.name = 'EOFError';
    }
}

// TODO IllegalStateError
export class IllegalStateError extends Error {
    constructor(message : string) {
      super(message); //sends 'message' to the parent Error constructor
      Object.setPrototypeOf(this, IllegalStateError.prototype); //ensures proper behavior of an Error as an instance of IllegalStateError
      this.name = 'IllegalStateError';
    }
}
// TODO: FileMode
export enum FileMode {
Read = 0,
Write = 1 << 0,
ReadWrite = 1 << 1,
Append = 1 << 2,
WriteAppend = 1 << 3,
ReadWriteAppend = 1 << 4
} //how is bitwise manipulation important to the solution i.e. 1 << 2

// TODO: FileHandle
export interface FileHandle {
  read : number;
  
  write : Uint8Array;
  seek : number;
}

// TODO: File
