import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminGuard from './components/AdminGuard'
import ErrorBoundary from './components/ErrorBoundary'
import { RoutePageMeta } from './components/PageMeta'
import AdminHome from './pages/admin/AdminHome'
import AdminLogin from './pages/admin/AdminLogin'
import AdminTestEdit from './pages/admin/AdminTestEdit'
import Main from './pages/Main'
import NotFound from './pages/NotFound'
import Result from './pages/Result'
import Test from './pages/Test'
import TestDetail from './pages/TestDetail'
import TestList from './pages/TestList'

export default function App() {
  return (
    <BrowserRouter>
      <RoutePageMeta />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/tests" element={<TestList />} />
          <Route path="/tests/:slug" element={<TestDetail />} />
          <Route path="/tests/:slug/play" element={<Test />} />
          <Route path="/tests/:slug/result" element={<Result />} />
          <Route path="/test/:slug" element={<Navigate to="/tests" replace />} />
          <Route path="/result/:slug" element={<Navigate to="/tests" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                {() => <AdminHome />}
              </AdminGuard>
            }
          />
          <Route
            path="/admin/tests/:id"
            element={
              <AdminGuard>
                {() => <AdminTestEdit />}
              </AdminGuard>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
