export class EOFError extends Error {
    constructor(message : string) {
      super(message);
      Object.setPrototypeOf(this, EOFError.prototype);
      this.name = 'EOFError';
    }
}

// IllegalStateError
export class IllegalStateError extends Error {
    constructor(message : string) {
      super(message); //sends 'message' to the parent Error constructor
      Object.setPrototypeOf(this, IllegalStateError.prototype); //ensures proper behavior of an Error as an instance of IllegalStateError
      this.name = 'IllegalStateError';
    }
}
// FileMode
export enum FileMode {
Read = 0,       // 0
Write = 1 << 0,     //1
ReadWrite = 1 << 1,   //2
Append = 1 << 2,      //4
WriteAppend = 1 << 3,    //8
ReadWriteAppend = 1 << 4   //16
} //how is bitwise manipulation important to the solution i.e. 1 << 2
  //answer: ohhhhh it lets you type the decimal of the assigned binary number?
  
// FileHandle
export interface FileHandle {
  read(num: number): Uint8Array; //read at most given number of bytes from file. Throw EOFError if no bytes are left. Returns Uint8Array of bytes read.

  write(data: Uint8Array): void; //writes all bytes in array to file;

  truncate(): void; //ends file at current point. only allowed in "write" mode.

  seek(num: number): void; // moves point where reading/writing to the point given within file. throw RangeError if number is negative or beyond file end.
}

// TODO: File
export class File implements FileHandle{

  private data : Uint8Array;
  private mode : FileMode;
  private pos : number;

  constructor() {
    this.data = new Uint8Array(0);
    this.pos = 0;
    this.mode = FileMode.Read;
  }

  read(num: number): Uint8Array {
    if(this.data.byteLength < num) 
      throw new EOFError ("Cannot read past file byte size");
    
    const bytes2Read = Math.min(num, this.data.length - this.pos);
    const result = this.data.slice(this.pos, this.pos + bytes2Read);
    this.pos += bytes2Read; //adjusts position in array;
    return result;
  }

  write(data: Uint8Array): void {
    if (this.mode == FileMode.Read)
      throw new IllegalStateError("Cannot write while in read mode");

    const data3 = new Uint8Array(this.data.length + data.length)
  }

  truncate(): void {
   if (this.mode != FileMode.Write && this.mode != FileMode.WriteAppend)
    throw new IllegalStateError("Can only truncate in write mode");
   else
    this.setLength(this.pos);

  }
  
  seek(num: number): void {
    if (num > this.getLength() || num < 0)
      throw new RangeError("Cannot seek outside of file bounds");
    else 
      this.pos = num;
  }

  getLength(){
    return this.data.length;
  }

  setLength(num: number) {
    if (num < 0)
      throw new RangeError ("length cannot be negative"); //duh

    const data2 = new Uint8Array(num);
    data2.set(this.data.slice(0, num)); //slices chunk (0 -> arg) out of data and sets to data2
    this.data = data2;
  }

  clear(){
    this.setLength(0);
  }

  open(num: number) {
    if (this.mode == 1)
      this.clear(); 

    if (this.mode == 4 || this.mode == 8 || this.mode == 16) 
      this.pos = this.data.length;
    else 
      this.pos = 0;

    return this; 
  }
}

