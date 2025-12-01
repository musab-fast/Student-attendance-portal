import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    const breadcrumbNameMap = {
        'admin': 'Admin',
        'teacher': 'Teacher',
        'student': 'Student',
        'users': 'User Management',
        'courses': 'Course Management',
        'assign-courses': 'Assign Courses',
        'fees': 'Fee Management',
        'timetable': 'Timetable',
        'reports': 'Reports',
        'attendance': 'Attendance',
        'results': 'Results'
    };

    if (pathnames.length === 0 || pathnames[0] === '') {
        return null;
    }

    return (
        <nav className="flex items-center gap-2 text-sm mb-6 animate-fadeInUp">
            <Link
                to="/"
                className="text-[#6B7280] hover:text-[#1D4ED8] transition-colors flex items-center gap-1"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
            </Link>

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const displayName = breadcrumbNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

                return (
                    <React.Fragment key={routeTo}>
                        <svg className="w-4 h-4 text-[#4B5563]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        {isLast ? (
                            <span className="text-[#F5F5F5] font-medium">{displayName}</span>
                        ) : (
                            <Link
                                to={routeTo}
                                className="text-[#6B7280] hover:text-[#1D4ED8] transition-colors"
                            >
                                {displayName}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;



