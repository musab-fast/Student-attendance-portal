import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';
import AssignCourse from './pages/AssignCourse';
import FeeManagement from './pages/FeeManagement';
import Reports from './pages/Reports';
import AttendanceManagement from './pages/AttendanceManagement';
import ResultManagement from './pages/ResultManagement';
import MyAttendance from './pages/MyAttendance';
import MyResults from './pages/MyResults';
import MyFees from './pages/MyFees';
import StudentTimetable from './pages/StudentTimetable';
import TeacherTimetable from './pages/TeacherTimetable';
import AdminTimetable from './pages/AdminTimetable';
import Notifications from './pages/Notifications';
import Announcements from './pages/Announcements';
import AnnouncementManagement from './pages/AnnouncementManagement';
import StudentProfile from './pages/StudentProfile';
import TeacherProfile from './pages/TeacherProfile';
import LeaveRequests from './pages/LeaveRequests';
import LeaveManagement from './pages/LeaveManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute role="admin">
              <CourseManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assign-courses"
          element={
            <ProtectedRoute role="admin">
              <AssignCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fees"
          element={
            <ProtectedRoute role="admin">
              <FeeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute role="admin">
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/timetable"
          element={
            <ProtectedRoute role="admin">
              <AdminTimetable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute role="teacher">
              <AttendanceManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/results"
          element={
            <ProtectedRoute role="teacher">
              <ResultManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute role="student">
              <MyAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/results"
          element={
            <ProtectedRoute role="student">
              <MyResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/fees"
          element={
            <ProtectedRoute role="student">
              <MyFees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/timetable"
          element={
            <ProtectedRoute role="student">
              <StudentTimetable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/timetable"
          element={
            <ProtectedRoute role="teacher">
              <TeacherTimetable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute role="admin">
              <AnnouncementManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leave-management"
          element={
            <ProtectedRoute role="admin">
              <LeaveManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="student">
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/leave-requests"
          element={
            <ProtectedRoute role="student">
              <LeaveRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute role="teacher">
              <TeacherProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
