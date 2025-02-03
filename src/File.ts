// EOFError (End of File) Error for end of file condition
export class EOFError extends Error {
    constructor(message : string) {
      super(message);
      Object.setPrototypeOf(this, EOFError.prototype);
      this.name = 'EOFError';
    }
}

// IllegalStateError to handle iilegal mode i.e. truncating in a non write mode
export class IllegalStateError extends Error {
    constructor(message : string) {
      super(message); //sends 'message' to the parent Error constructor
      Object.setPrototypeOf(this, IllegalStateError.prototype); //ensures proper behavior of an Error as an instance of IllegalStateError
      this.name = 'IllegalStateError';
    }
}

// Enum representing different file open modes using bitwise flags to shorten typing
export enum FileMode {
Read = 0,       // 0
Write = 1 << 0,     //1
ReadWrite = 1 << 1,   //2
Append = 1 << 2,      //4
WriteAppend = 1 << 3,    //8
ReadWriteAppend = 1 << 4   //16
} //how is bitwise manipulation important to the solution i.e. 1 << 2
  //answer: ohhhhh it lets you type the decimal of the assigned binary number
  

  /*
  reads up to the specified number of bytes from the file
  throws an EOFError if no bytes are left to read
  param num The number of bytes to read
  returns a Uint8Array of the bytes read
   */
export interface FileHandle {
  read(num: number): Uint8Array; 
  write(data: Uint8Array): void; 
  truncate(): void; 
  seek(num: number): void; 
}

//Class that implements FileHandle while supporting read, write, and append operations on files
export class File implements FileHandle{

  private data : Uint8Array; //stores file data
  private mode : FileMode; //current file mode
  private pos : number; //current position within file

  //constructs new empty file object; empty and in read mode
  constructor() {
    this.data = new Uint8Array(0);
    this.pos = 0;
    this.mode = FileMode.Read; //read by default
  }

  /*
  reads up to num bytes from file starting at pos
  param num is the number of bytes to read
  returns a Unit8Array containing bytes read
  thorws RangeError if num is negative
  throws EOFError if pos exceeds bounds
  */
  read(num: number): Uint8Array {
    if (num < 0)
      throw new RangeError("Cannot read out of bounds");
    if (this.pos >= this.data.length) 
      throw new EOFError("Cannot read past end of file.");
    
    const bytesToRead = Math.min(num, this.data.length - this.pos);
    const result = this.data.slice(this.pos, this.pos + bytesToRead);
    this.pos += bytesToRead;
    return result;
}
  /*
  writes specified data to file at pos
  param data is the data to write to file
  throws IllegalStateError if file is in read only mode
  */
  write(data: Uint8Array): void {
    if (this.mode == FileMode.Read)
      throw new IllegalStateError("Cannot write while in read mode");

    const data3 = new Uint8Array(this.data.length + data.length);
    data3.set(this.data.slice(0, this.pos));
    data3.set(data, this.pos);
    this.data = data3;
    this.pos += data.length;
  }
  /*
  truncates files to current pos
  only allowed in write mode
  throws IllegalStateError if not in a write mode
  */
  truncate(): void {
   if (this.mode == 0 || this.mode == 4)
    throw new IllegalStateError("Can only truncate in a write mode");
   else
    this.setLength(this.pos);
  }

  /*
  moves pos within file to num
  param num is the pos to seek to
  throws RangeError if pos is invalid
  */
  seek(num: number): void {
    if (num > this.getLength() || num < 0)
      throw new RangeError("Cannot seek outside of file bounds");
    else 
      this.pos = num;
  }

  //returns length of file in bytes
  getLength(){
    return this.data.length;
  }
  
  /*
  sets length of file to specified alue
  if length is increased, new bytes are padded
  if length is decreased, excess data is thrown out
  param num is new file length
  throws RangeError if num is negative
  */
  setLength(num: number) {
    if (num < 0)
      throw new RangeError ("length cannot be negative"); //duh

    const data2 = new Uint8Array(num);
    data2.set(this.data.slice(0, num)); //slices chunk (0 -> arg) out of data and sets to data2
    this.data = data2;
  }

  //clears file contents by setting length to 0
  clear(){
    this.setLength(0);
  }

  /*
  opens file in specified mode
  param num is bitwise flag of mode that is compared to if statements to match conditions
  of each file mode
  returns itself 
  */
  open(num: number) {

    this.mode = num;

    if (this.mode == 1) //if in write mode, clear;
      this.clear(); 

    if (this.mode == 4 || this.mode == 8 || this.mode == 16) //if in any append mode, adjust pos to EOF
      this.pos = this.data.length;
    else 
      this.pos = 0;

    return this; 
  }
}

