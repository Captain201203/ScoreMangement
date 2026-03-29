export interface IClass{
    _id?: string; // ID của MongoDB
    classId: string;
    majorName: string;
    teacherName: string;
    teacherId: string; // ✨ Thêm trường này để phân quyền chính xác

}