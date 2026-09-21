import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Toaster } from 'sonner';

// Public Pages
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotificationsPage } from '@/pages/NotificationsPage';

// Student Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentInternships } from '@/pages/student/StudentInternships';
import { StudentApplications } from '@/pages/student/StudentApplications';
import { StudentCoding } from '@/pages/student/StudentCoding';
import { StudentAssessments } from '@/pages/student/StudentAssessments';
import { StudentSkills } from '@/pages/student/StudentSkills';
import { StudentPortfolio } from '@/pages/student/StudentPortfolio';
import { StudentPrograms } from '@/pages/student/StudentPrograms';
import { StudentCollaboration } from '@/pages/student/StudentCollaboration';

// Faculty Pages
import { FacultyDashboard } from '@/pages/faculty/FacultyDashboard';
import { FacultyOpportunities } from '@/pages/faculty/FacultyOpportunities';
import { FacultyApplications } from '@/pages/faculty/FacultyApplications';
import { FacultyMentorship } from '@/pages/faculty/FacultyMentorship';
import { FacultyWorkshops } from '@/pages/faculty/FacultyWorkshops';

// Industry Pages
import { IndustryDashboard } from '@/pages/industry/IndustryDashboard';
import { IndustryInternships } from '@/pages/industry/IndustryInternships';
import { IndustryCandidates } from '@/pages/industry/IndustryCandidates';
import { IndustryJobs } from '@/pages/industry/IndustryJobs';
import { IndustryPrograms } from '@/pages/industry/IndustryPrograms';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics';
import { AdminStudents } from '@/pages/admin/AdminStudents';
import { AdminFaculty } from '@/pages/admin/AdminFaculty';
import { AdminVerification } from '@/pages/admin/AdminVerification';
import { AdminCertificates } from '@/pages/admin/AdminCertificates';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Student Portal */}
          <Route
            path="/student"
            element={
              <ProtectedRoute roles={['STUDENT']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="internships" element={<StudentInternships />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="coding" element={<StudentCoding />} />
            <Route path="assessments" element={<StudentAssessments />} />
            <Route path="skills" element={<StudentSkills />} />
            <Route path="portfolio" element={<StudentPortfolio />} />
            <Route path="programs" element={<StudentPrograms />} />
            <Route path="collaboration" element={<StudentCollaboration />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Faculty Portal */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute roles={['FACULTY']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<FacultyDashboard />} />
            <Route path="opportunities" element={<FacultyOpportunities />} />
            <Route path="applications" element={<FacultyApplications />} />
            <Route path="mentorship" element={<FacultyMentorship />} />
            <Route path="workshops" element={<FacultyWorkshops />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Industry Portal */}
          <Route
            path="/industry"
            element={
              <ProtectedRoute roles={['INDUSTRY']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<IndustryDashboard />} />
            <Route path="internships" element={<IndustryInternships />} />
            <Route path="candidates" element={<IndustryCandidates />} />
            <Route path="jobs" element={<IndustryJobs />} />
            <Route path="programs" element={<IndustryPrograms />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Admin Portal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="faculty" element={<AdminFaculty />} />
            <Route path="verification" element={<AdminVerification />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
