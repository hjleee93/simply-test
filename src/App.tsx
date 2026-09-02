import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RoutePageMeta } from './components/PageMeta'
import Main from './pages/Main'
import Result from './pages/Result'
import Test from './pages/Test'
import TestDetail from './pages/TestDetail'
import TestList from './pages/TestList'

export default function App() {
  return (
    <BrowserRouter>
      <RoutePageMeta />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/tests" element={<TestList />} />
        <Route path="/tests/:slug" element={<TestDetail />} />
        <Route path="/tests/:slug/play" element={<Test />} />
        <Route path="/tests/:slug/result" element={<Result />} />
        <Route path="/test/:slug" element={<Navigate to="/tests" replace />} />
        <Route path="/result/:slug" element={<Navigate to="/tests" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
