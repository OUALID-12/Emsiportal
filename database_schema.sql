
-- Database Schema for School Attendance Management System

-- Users Table (for both students and supervisors)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'supervisor', 'admin')),
    profile_image_url TEXT,
    phone_number VARCHAR(20),
    address TEXT,
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Students Table (extends users)
CREATE TABLE students (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    class_id UUID REFERENCES classes(id),
    year VARCHAR(20) NOT NULL,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Supervisors Table (extends users)
CREATE TABLE supervisors (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    supervisor_id VARCHAR(20) UNIQUE NOT NULL,
    responsibilities TEXT[]
);

-- Classes Table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    professor VARCHAR(100) NOT NULL,
    room VARCHAR(50),
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    class_id UUID REFERENCES classes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Absences Table
CREATE TABLE absences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'justified', 'unjustified')),
    reason TEXT,
    description TEXT,
    document_url TEXT,
    submitted_on TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'bot')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_absences_student_id ON absences(student_id);
CREATE INDEX idx_absences_date ON absences(date);
CREATE INDEX idx_absences_status ON absences(status);
CREATE INDEX idx_courses_class_id ON courses(class_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE
ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE
ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE
ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_absences_updated_at BEFORE UPDATE
ON absences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to notify when absence status changes
CREATE OR REPLACE FUNCTION notify_absence_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status != OLD.status THEN
        INSERT INTO notifications (user_id, title, message)
        VALUES (
            NEW.student_id, 
            'Absence Status Updated', 
            'Your absence on ' || NEW.date || ' has been marked as ' || NEW.status
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER absence_status_change_notification AFTER UPDATE
ON absences FOR EACH ROW EXECUTE FUNCTION notify_absence_status_change();
