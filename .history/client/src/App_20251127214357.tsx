import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationContainer from "./components/NotificationContainer";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Success from "./pages/Success";
import MiniCourseSignup from "./pages/MiniCourseSignup";
import CourseInfo from "./pages/CourseInfo";
import FreeCourseIntro from "./pages/FreeCourseIntro";
import CourseAccess from "./pages/CourseAccess";
import Login from "./pages/Login";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/course"} component={Course} />
      <Route path={"/success"} component={Success} />
      <Route path={"/mini-course"} component={MiniCourseSignup} />
      <Route path={"/course-info"} component={CourseInfo} />
      <Route path={"/kostenloser-kurs"} component={FreeCourseIntro} />
      <Route path={"/course-access"} component={CourseAccess} />
      <Route path={"/login"} component={Login} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <NotificationContainer />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
