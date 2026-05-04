import { jest } from '@jest/globals';
import { addNote, listNotes } from '../src/tools/noteTools';
describe('Note Tools', () => {
    let mockDb;
    beforeEach(async () => {
        mockDb = {
            prepare: jest.fn(),
        };
        await jest.unstable_mockModule('../src/db', () => ({
            default: mockDb,
        }));
    });
    test('should add a note', async () => {
        const mockStmt = {
            run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
        };
        mockDb.prepare.mockReturnValue(mockStmt);
        const result = await addNote({ title: 'Test Note', content: 'Test Content' });
        expect(result).toContain('Not başarıyla eklendi');
        expect(result).toContain('ID: 1');
        expect(mockDb.prepare).toHaveBeenCalledWith('INSERT INTO notes (title, content) VALUES (?, ?)');
        expect(mockStmt.run).toHaveBeenCalledWith('Test Note', 'Test Content');
    });
    test('should list all notes', async () => {
        const mockStmt = {
            all: jest.fn().mockReturnValue([
                { id: 1, title: 'Note 1', content: 'Content 1' },
                { id: 2, title: 'Note 2', content: 'Content 2' },
            ]),
        };
        mockDb.prepare.mockReturnValue(mockStmt);
        const result = await listNotes({});
        const notes = JSON.parse(result);
        expect(notes).toHaveLength(2);
        expect(notes[0].title).toBe('Note 1');
        expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM notes');
        expect(mockStmt.all).toHaveBeenCalledWith();
    });
    test('should list notes with search', async () => {
        const mockStmt = {
            all: jest.fn().mockReturnValue([
                { id: 1, title: 'Apple Note', content: 'About apples' },
            ]),
        };
        mockDb.prepare.mockReturnValue(mockStmt);
        const result = await listNotes({ search: 'Apple' });
        const notes = JSON.parse(result);
        expect(notes).toHaveLength(1);
        expect(notes[0].title).toBe('Apple Note');
        expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM notes WHERE title LIKE ?');
        expect(mockStmt.all).toHaveBeenCalledWith('%Apple%');
    });
});
//# sourceMappingURL=noteTools.test.js.map