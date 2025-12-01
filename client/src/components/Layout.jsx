import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import Breadcrumb from './Breadcrumb';
import Footer from './Footer';

const Layout = ({ role, children, showBreadcrumb = true }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0d1117]">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 fixed lg:sticky top-0 h-screen z-40`}>
                <Sidebar role={role} isCollapsed={isSidebarCollapsed} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] pointer-events-none" />

                <div className="relative z-10 flex-1 flex flex-col">
                    <TopNavbar role={role} onToggleSidebar={toggleSidebar} />

                    <main className="flex-1 p-6 lg:p-10 custom-scrollbar overflow-y-auto">
                        <div className="max-w-7xl mx-auto space-y-6">
                            {showBreadcrumb && <Breadcrumb />}
                            {children}
                        </div>
                    </main>

                    <Footer role={role} />
                </div>
            </div>
        </div>
    );
};

export default Layout;



