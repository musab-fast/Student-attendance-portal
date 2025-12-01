const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const Course = require('./models/Course');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
    try {
        // Connect to database first
        await connectDB();

        console.log('🔄 Clearing existing data...');

        // Clear existing data
        await User.deleteMany();
        await Teacher.deleteMany();
        await Student.deleteMany();
        await Course.deleteMany();

        console.log('✅ Existing data cleared');
        console.log('🔄 Creating new data...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // ===== CREATE ADMIN =====
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });

        // ===== CREATE TEACHERS =====
        const teacher1User = await User.create({
            name: 'Dr. John Smith',
            email: 'john.smith@example.com',
            password: hashedPassword,
            role: 'teacher',
        });

        const teacher2User = await User.create({
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@example.com',
            password: hashedPassword,
            role: 'teacher',
        });

        const teacher3User = await User.create({
            name: 'Prof. Michael Brown',
            email: 'michael.brown@example.com',
            password: hashedPassword,
            role: 'teacher',
        });

        // Create Teacher profiles
        const teacher1 = await Teacher.create({
            user_id: teacher1User._id,
            teacher_id: 'T001',
            department: 'Computer Science',
            assigned_courses: [], // Will be populated when courses are created
        });

        const teacher2 = await Teacher.create({
            user_id: teacher2User._id,
            teacher_id: 'T002',
            department: 'Mathematics',
            assigned_courses: [],
        });

        const teacher3 = await Teacher.create({
            user_id: teacher3User._id,
            teacher_id: 'T003',
            department: 'Computer Science',
            assigned_courses: [],
        });

        // ===== CREATE STUDENTS =====
        const student1User = await User.create({
            name: 'Alice Williams',
            email: 'alice.williams@example.com',
            password: hashedPassword,
            role: 'student',
        });

        const student2User = await User.create({
            name: 'Bob Davis',
            email: 'bob.davis@example.com',
            password: hashedPassword,
            role: 'student',
        });

        const student3User = await User.create({
            name: 'Charlie Wilson',
            email: 'charlie.wilson@example.com',
            password: hashedPassword,
            role: 'student',
        });

        const student4User = await User.create({
            name: 'Diana Martinez',
            email: 'diana.martinez@example.com',
            password: hashedPassword,
            role: 'student',
        });

        const student5User = await User.create({
            name: 'Ethan Anderson',
            email: 'ethan.anderson@example.com',
            password: hashedPassword,
            role: 'student',
        });

        // Create Student profiles
        const student1 = await Student.create({
            user_id: student1User._id,
            student_id: 'S001',
            department: 'Computer Science',
            semester: '5',
            section: 'A',
            roll_number: 'CS-2021-001',
            enrolled_courses: [],
        });

        const student2 = await Student.create({
            user_id: student2User._id,
            student_id: 'S002',
            department: 'Computer Science',
            semester: '5',
            section: 'A',
            roll_number: 'CS-2021-002',
            enrolled_courses: [],
        });

        const student3 = await Student.create({
            user_id: student3User._id,
            student_id: 'S003',
            department: 'Computer Science',
            semester: '5',
            section: 'B',
            roll_number: 'CS-2021-003',
            enrolled_courses: [],
        });

        const student4 = await Student.create({
            user_id: student4User._id,
            student_id: 'S004',
            department: 'Computer Science',
            semester: '3',
            section: 'A',
            roll_number: 'CS-2022-001',
            enrolled_courses: [],
        });

        const student5 = await Student.create({
            user_id: student5User._id,
            student_id: 'S005',
            department: 'Computer Science',
            semester: '3',
            section: 'A',
            roll_number: 'CS-2022-002',
            enrolled_courses: [],
        });

        // ===== CREATE COURSES =====
        const course1 = await Course.create({
            course_id: 'CS501',
            course_name: 'Data Structures and Algorithms',
            credit_hours: 3,
            semester: '5',
            instructor_id: teacher1User._id,
        });

        const course2 = await Course.create({
            course_id: 'CS502',
            course_name: 'Database Management Systems',
            credit_hours: 3,
            semester: '5',
            instructor_id: teacher3User._id,
        });

        const course3 = await Course.create({
            course_id: 'CS503',
            course_name: 'Web Development',
            credit_hours: 4,
            semester: '5',
            instructor_id: teacher1User._id,
        });

        const course4 = await Course.create({
            course_id: 'MATH301',
            course_name: 'Linear Algebra',
            credit_hours: 3,
            semester: '3',
            instructor_id: teacher2User._id,
        });

        const course5 = await Course.create({
            course_id: 'CS301',
            course_name: 'Object Oriented Programming',
            credit_hours: 4,
            semester: '3',
            instructor_id: teacher3User._id,
        });

        teacher1.assigned_courses = [course1._id, course3._id];
        await teacher1.save();

        teacher2.assigned_courses = [course4._id];
        await teacher2.save();

        teacher3.assigned_courses = [course2._id, course5._id];
        await teacher3.save();


        student1.enrolled_courses = [course1._id, course2._id, course3._id];
        await student1.save();

        student2.enrolled_courses = [course1._id, course2._id, course3._id];
        await student2.save();

        // Semester 5, Section B student
        student3.enrolled_courses = [course1._id, course2._id];
        await student3.save();

        // Semester 3, Section A students
        student4.enrolled_courses = [course4._id, course5._id];
        await student4.save();

        student5.enrolled_courses = [course4._id, course5._id];
        await student5.save();

        console.log('\n✅ Data Imported Successfully!\n');
        console.log('='.repeat(60));
        console.log('LOGIN CREDENTIALS (password for all: password123)');
        console.log('='.repeat(60));
        console.log('\n👤 ADMIN:');
        console.log('   Email: admin@example.com');
        console.log('\n👨‍🏫 TEACHERS:');
        console.log('   1. john.smith@example.com (CS - DSA, Web Dev)');
        console.log('   2. sarah.johnson@example.com (Math - Linear Algebra)');
        console.log('   3. michael.brown@example.com (CS - DBMS, OOP)');
        console.log('\n👨‍🎓 STUDENTS:');
        console.log('   1. alice.williams@example.com (Sem 5, Sec A)');
        console.log('   2. bob.davis@example.com (Sem 5, Sec A)');
        console.log('   3. charlie.wilson@example.com (Sem 5, Sec B)');
        console.log('   4. diana.martinez@example.com (Sem 3, Sec A)');
        console.log('   5. ethan.anderson@example.com (Sem 3, Sec A)');
        console.log('\n' + '='.repeat(60) + '\n');

        process.exit(0);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

importData();
