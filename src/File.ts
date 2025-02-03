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
  read(num: number): Uint8Array; //read at most given number of bytes from file. Throw EOFError if no bytes are left. Returns Uint8Array of bytes read.

  write(array: Uint8Array): void; //writes all bytes in array to file;

  truncate(): void; //ends file at current point. only allowed in "write" mode.

  seek(num: number): void; // moves point where reading/writing to the point given within file. throw RangeError if number is negative or beyond file end.
}

export class File implements FileHandle{

  private data : Uint8Array;
  private mode : FileMode;
  private pos : number;

  constructor() {
    this.data = new Uint8Array(0);
    this.pos = 0;
    this.mode = FileMode.Read;
  }

  read(arg: number): Uint8Array {
    throw new Error("Method not implemented.");
  }
  write(arg: Uint8Array): void {
    throw new Error("Method not implemented.");
  }
  truncate(arg: File): void {
   throw new Error("Method not implemented.");
  }
  seek(arg: number): void {
    throw new Error("Method not implemented.");
  }

  getLength(){
    return this.data.length;
  }

  setLength(arg: number) {
    if (arg < 0)
      return new RangeError, "length cannot be negative";


    


  }

  clear(){

  }

  open(arg: number) {


    return new File;
  }


}
// TODO: File
