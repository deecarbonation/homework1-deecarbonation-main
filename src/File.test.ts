import { EOFError, IllegalStateError, File, FileMode } from "./File";

describe("File length", () => {
    test("create empty file", () => {
        const f = new File();
        expect(f.getLength()).toBe(0);
    });
    test("set length", () => {
        const f = new File();
        f.setLength(100);
        expect(f.getLength()).toBe(100);
    });
    test("set length again", () => {
        const f = new File();
        f.setLength(100);
        f.setLength(20);
        expect(f.getLength()).toBe(20);
    });
    test("clear", () => {
        const f = new File();
        f.setLength(100);
        f.clear();
        expect(f.getLength()).toBe(0);
    });
    test("set length larger", () => {
        const f = new File();
        f.setLength(100);
        f.setLength(103);
        expect(f.getLength()).toBe(103);
    });
});

describe("File open", () => {
    test("open read", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        expect(h).toBeDefined();
        expect(f.getLength()).toBe(10);
    });
    test("open write", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Write);
        expect(h).toBeDefined();
        expect(f.getLength()).toBe(0);
    });
    test("open append", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Append);
        expect(h).toBeDefined();
        expect(f.getLength()).toBe(10);
    });
    test("open read/write", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.ReadWrite);
        expect(h).toBeDefined();
        expect(f.getLength()).toBe(10);
    });
    test("open write/append", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.WriteAppend);
        expect(h).toBeDefined();
        expect(f.getLength()).toBe(10);
    });
    test("open read/write/append", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.ReadWriteAppend);
        expect(h).toBeDefined();
        expect(f.getLength()).toBe(10);
    });
});

describe("File read zeros", () => {
    test("read fewer zeros", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        const b = h.read(5);
        expect(b).toEqual(new Uint8Array(5));
    });
    test("read exactly enough zeros", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        const b = h.read(10);
        expect(b).toEqual(new Uint8Array(10));
    });
    test("read too many zeros", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        const b = h.read(15);
        expect(b).toEqual(new Uint8Array(10));
    });
    test("read when none", () => {
        const f = new File();
        const h = f.open(FileMode.Read);
        expect(() => h.read(5)).toThrow(EOFError);
    });
    test("read successively", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        expect(h.read(5)).toEqual(new Uint8Array(5));
        expect(h.read(5)).toEqual(new Uint8Array(5));
    });
    test("read successively extra", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        expect(h.read(5)).toEqual(new Uint8Array(5));
        expect(h.read(10)).toEqual(new Uint8Array(5));
    });
    test("read from longer file", () => {
        const f = new File();
        f.setLength(100);
        const h = f.open(FileMode.Read);
        expect(h.read(10)).toEqual(new Uint8Array(10));
        expect(h.read(10)).toEqual(new Uint8Array(10));
        expect(h.read(20)).toEqual(new Uint8Array(20));
        expect(h.read(40)).toEqual(new Uint8Array(40));
        expect(h.read(80)).toEqual(new Uint8Array(20));
    });
});

describe("File write", () => {
    test("write zeros", () => {
        const f = new File();
        const h = f.open(FileMode.Write);
        h.write(new Uint8Array(10));
        expect(f.getLength()).toBe(10);
    });
    test("write zeros twice", () => {
        const f = new File();
        const h = f.open(FileMode.Write);
        h.write(new Uint8Array(10));
        h.write(new Uint8Array(10));
        expect(f.getLength()).toBe(20);
    });
    test("write zeros and read", () => {
        const f = new File();
        const h = f.open(FileMode.Write);
        h.write(new Uint8Array(10));
        expect(f.getLength()).toBe(10);
        const h2 = f.open(FileMode.Read);
        expect(h2.read(10)).toEqual(new Uint8Array(10));
    });
    test("write zeros and read twice", () => {
        const f = new File();
        const h = f.open(FileMode.Write);
        h.write(new Uint8Array(10));
        expect(f.getLength()).toBe(10);
        const h2 = f.open(FileMode.Read);
        expect(h2.read(5)).toEqual(new Uint8Array(5));
        expect(h2.read(10)).toEqual(new Uint8Array(5));
    });
    test("write data and read", () => {
        const f = new File();
        const h = f.open(FileMode.Write);
        const u = new Uint8Array([5,3,2,1,1]);
        h.write(u);
        expect(f.getLength()).toBe(5);
        const h2 = f.open(FileMode.Read);
        expect(h2.read(10)).toEqual(u);
    });
    test("write nothing only clears", () => {
        const f = new File();
        f.setLength(15);
        const h = f.open(FileMode.Write);
        h.write(new Uint8Array(0));
        expect(f.getLength()).toBe(0);
    })
    test("overwrite data and read", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Write);
        const u = new Uint8Array([5,3,2,1,1]);
        h.write(u);
        expect(f.getLength()).toBe(5);
        const h2 = f.open(FileMode.Read);
        expect(h2.read(10)).toEqual(u);
    });
    test("append data and read", () => {
        const f = new File();
        f.setLength(5);
        const h = f.open(FileMode.WriteAppend);
        const u = new Uint8Array([5,3,2,1,1]);
        h.write(u);
        expect(f.getLength()).toBe(10);
        const h2 = f.open(FileMode.Read);
        expect(h2.read(5)).toEqual(new Uint8Array(5));
        expect(h2.read(10)).toEqual(u);
    });
    test("append nohting is NOP", () => {
        const f = new File();
        f.setLength(5);
        const h = f.open(FileMode.WriteAppend);
        h.write(new Uint8Array(0));
        expect(f.getLength()).toBe(5);
    });
    test("write over data and read", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.ReadWrite);
        const u = new Uint8Array([5,3,2,1,1]);
        h.write(u);
        expect(f.getLength()).toBe(10);
        expect(h.read(10)).toEqual(new Uint8Array(5));
        const h2 = f.open(FileMode.Read);
        expect(h2.read(5)).toEqual(u);
    });
    test("write overdata and truncate", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.ReadWrite);
        const u = new Uint8Array([5,3,2,1,1]);
        h.write(u);
        expect(f.getLength()).toBe(10);
        h.truncate();
        expect(f.getLength()).toBe(5);
    });
    test("write overlap end", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.ReadWrite);
        const u = new Uint8Array([5,3,2,1,1]);
        h.write(u);
        expect(f.getLength()).toBe(10);
        h.seek(7);
        h.write(u);
        expect(f.getLength()).toBe(12);
        const h2 = f.open(FileMode.Read);
        expect(h2.read(12)).toEqual(new Uint8Array([5,3,2,1,1,0,0,5,3,2,1,1]));
    });
    test("lost write not recovered", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Write);
        const u = new Uint8Array([5,3,2,1,1]);
        h.write(u);
        f.setLength(3);
        f.setLength(5);
        const h2 = f.open(FileMode.Read);
        expect(h2.read(10)).toEqual(new Uint8Array([5,3,2,0,0]));
    });
    test("write doesn't truncate always", () => {
        const f = new File();
        const h = f.open(FileMode.Write);
        f.setLength(10);
        const u = new Uint8Array([5,3,2,1,1]);
        h.write(u);
        expect(f.getLength()).toBe(10);
    });
    test("manual truncate works", () => {
        const f = new File();
        const h = f.open(FileMode.Write);
        f.setLength(10);
        const u = new Uint8Array([5,3,2,1,1]);
        h.write(u);
        h.truncate();
        expect(f.getLength()).toBe(5);
    });
})

describe("File seek tests", () => {
    test("seek to beginning", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        h.read(10);
        h.seek(0);
        expect(h.read(5)).toEqual(new Uint8Array(5));
    });
    test("seek to middle", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        h.read(10);
        h.seek(5);
        expect(h.read(5)).toEqual(new Uint8Array(5));
    });
    test("seek to end", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        h.seek(10);
        expect(() => h.read(5)).toThrow(EOFError);
    });
    test("seek past end", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        expect(() => h.seek(11)).toThrow(RangeError);
    });
    test("seek negative", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        expect(() => h.seek(-1)).toThrow(RangeError);
    });
    test("write/seek/read", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.ReadWrite);
        h.write(new Uint8Array([5,3,2,1,1]));
        h.seek(0);
        expect(h.read(5)).toEqual(new Uint8Array([5,3,2,1,1]));
    });
    test("write/seek/mid/read ", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.ReadWrite);
        h.write(new Uint8Array([5,3,2,1,1]));
        h.seek(2);
        expect(h.read(5)).toEqual(new Uint8Array([2,1,1,0,0]));
    });
    test("append/seek/write", () => {
        const f = new File();
        f.setLength(5);
        const h = f.open(FileMode.ReadWriteAppend);
        h.write(new Uint8Array([5,3,2,1,1]));
        h.seek(3);
        expect(h.read(5)).toEqual(new Uint8Array([0,0,5,3,2]));
    });
})

describe("File read/write errors", () => {
    test("read from write", () => {
        const f = new File();
        const h = f.open(FileMode.Write);
        expect(() => h.read(5)).toThrow(IllegalStateError);
    });
    test("write from read", () => {
        const f = new File();
        const h = f.open(FileMode.Read);
        expect(() => h.write(new Uint8Array(5))).toThrow(IllegalStateError);
    });
    test("seek outside", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        expect(() => h.seek(15)).toThrow(RangeError);
    });
    test("seek negative", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        expect(() => h.seek(-5)).toThrow(RangeError);
    });
    test("truncate from read", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Read);
        expect(() => h.truncate()).toThrow(IllegalStateError);
    });
    test("truncate from append", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.Append);
        expect(() => h.truncate()).toThrow(IllegalStateError);
    });
    test("seek after truncate", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.ReadWrite);
        h.write(new Uint8Array([7,7,7]));
        h.truncate();
        expect(() => h.seek(5)).toThrow(RangeError);
    });
    test("write after truncate", () => {
        const f = new File();
        f.setLength(10);
        const h = f.open(FileMode.ReadWrite);
        h.truncate();
        h.write(new Uint8Array(5));
        expect(f.getLength()).toBe(5);
    });
    test("read negative", () => {
        const f = new File();
        const h = f.open(FileMode.Read);
        expect(() => h.read(-5)).toThrow(RangeError);
    });
})