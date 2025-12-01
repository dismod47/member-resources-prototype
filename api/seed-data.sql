-- Seed data: Demo posts that cannot be deleted or edited
-- Run this after creating the schema

-- Java Posts
INSERT INTO posts (title, description, timestamp, is_demo) VALUES
('Getting Started with Java: A Beginner''s Guide', 'Java is one of the most popular programming languages in the world. This post covers the fundamentals including variables, data types, and basic syntax. Perfect for those just starting their programming journey. We''ll also explore object-oriented programming concepts and best practices for writing clean Java code.', NOW() - INTERVAL '5 days', true),
('Java Spring Boot: Building RESTful APIs', 'Spring Boot makes it incredibly easy to build production-ready applications. In this guide, we''ll walk through creating a RESTful API with proper error handling, validation, and database integration. Learn about dependency injection, annotations, and the Spring ecosystem.', NOW() - INTERVAL '3 days', true);

-- Database Posts
INSERT INTO posts (title, description, timestamp, is_demo) VALUES
('PostgreSQL vs MySQL: Which Should You Choose?', 'Both PostgreSQL and MySQL are excellent database management systems, but they have different strengths. PostgreSQL excels in complex queries and advanced features, while MySQL is known for its speed and ease of use. We''ll compare performance, features, and use cases to help you make the right choice for your project.', NOW() - INTERVAL '7 days', true),
('SQL Query Optimization: Best Practices', 'Slow queries can cripple your application. Learn essential techniques for optimizing SQL queries including proper indexing, query execution plans, and common pitfalls to avoid. We''ll cover real-world examples and tools to help you identify and fix performance bottlenecks.', NOW() - INTERVAL '4 days', true),
('Database Design Fundamentals', 'Good database design is crucial for application scalability and performance. This post covers normalization, relationships, indexing strategies, and schema design patterns. Whether you''re designing from scratch or refactoring an existing database, these principles will guide you.', NOW() - INTERVAL '6 days', true);

-- Marketing Posts
INSERT INTO posts (title, description, timestamp, is_demo) VALUES
('Digital Marketing Strategies for 2024', 'The marketing landscape is constantly evolving. Stay ahead with the latest trends in SEO, content marketing, social media, and paid advertising. Learn about AI-powered marketing tools, personalization strategies, and measuring ROI effectively.', NOW() - INTERVAL '2 days', true),
('Content Marketing: Creating Engaging Content', 'Content is king, but quality trumps quantity. Discover how to create content that resonates with your audience, drives engagement, and converts leads. We''ll cover storytelling techniques, content formats, and distribution strategies that actually work.', NOW() - INTERVAL '8 days', true);

-- Coding Posts
INSERT INTO posts (title, description, timestamp, is_demo) VALUES
('Clean Code Principles: Writing Maintainable Software', 'Writing code that works is one thing, writing code that others can understand and maintain is another. Learn essential principles like SOLID, DRY, and KISS. We''ll explore code smells, refactoring techniques, and tools that help you write better code.', NOW() - INTERVAL '1 day', true),
('Version Control with Git: Essential Commands', 'Git is an essential tool for every developer. Master the most important Git commands and workflows including branching strategies, merge conflicts, and collaboration best practices. Perfect for both beginners and those looking to improve their Git skills.', NOW() - INTERVAL '9 days', true);

-- Python Posts
INSERT INTO posts (title, description, timestamp, is_demo) VALUES
('Python for Data Science: Pandas and NumPy Basics', 'Python has become the go-to language for data science. Learn how to manipulate data with Pandas, perform numerical operations with NumPy, and visualize your results. This guide covers everything from reading CSV files to performing complex data transformations.', NOW() - INTERVAL '10 days', true);

-- Comments for Post 1 (Java Beginner's Guide)
INSERT INTO comments (post_id, text, timestamp) VALUES
((SELECT id FROM posts WHERE title = 'Getting Started with Java: A Beginner''s Guide' LIMIT 1), 'Great introduction! The examples are really clear. Would love to see more on exception handling.', NOW() - INTERVAL '4 days'),
((SELECT id FROM posts WHERE title = 'Getting Started with Java: A Beginner''s Guide' LIMIT 1), 'This helped me understand OOP concepts much better. Thanks for sharing!', NOW() - INTERVAL '3 days'),
((SELECT id FROM posts WHERE title = 'Getting Started with Java: A Beginner''s Guide' LIMIT 1), 'Any recommendations for Java IDEs for beginners?', NOW() - INTERVAL '2 days');

-- Comments for Post 2 (Java Spring Boot)
INSERT INTO comments (post_id, text, timestamp) VALUES
((SELECT id FROM posts WHERE title = 'Java Spring Boot: Building RESTful APIs' LIMIT 1), 'Spring Boot is amazing! The auto-configuration saves so much time. Do you have examples with JWT authentication?', NOW() - INTERVAL '2 days'),
((SELECT id FROM posts WHERE title = 'Java Spring Boot: Building RESTful APIs' LIMIT 1), 'This is exactly what I needed for my project. Clear and well-explained.', NOW() - INTERVAL '1 day');

-- Comments for Post 3 (PostgreSQL vs MySQL)
INSERT INTO comments (post_id, text, timestamp) VALUES
((SELECT id FROM posts WHERE title = 'PostgreSQL vs MySQL: Which Should You Choose?' LIMIT 1), 'I''ve used both and I prefer PostgreSQL for its advanced features and JSON support.', NOW() - INTERVAL '6 days'),
((SELECT id FROM posts WHERE title = 'PostgreSQL vs MySQL: Which Should You Choose?' LIMIT 1), 'MySQL is still great for simple web applications. It depends on your use case really.', NOW() - INTERVAL '5 days'),
((SELECT id FROM posts WHERE title = 'PostgreSQL vs MySQL: Which Should You Choose?' LIMIT 1), 'Thanks for the comparison! Helped me decide to go with PostgreSQL for my new project.', NOW() - INTERVAL '4 days');

-- Comments for Post 4 (SQL Query Optimization)
INSERT INTO comments (post_id, text, timestamp) VALUES
((SELECT id FROM posts WHERE title = 'SQL Query Optimization: Best Practices' LIMIT 1), 'Indexing is crucial! I saw a 10x performance improvement after adding proper indexes.', NOW() - INTERVAL '3 days'),
((SELECT id FROM posts WHERE title = 'SQL Query Optimization: Best Practices' LIMIT 1), 'Can you explain more about query execution plans? That''s where I get confused.', NOW() - INTERVAL '2 days');

-- Comments for Post 5 (Database Design Fundamentals)
INSERT INTO comments (post_id, text, timestamp) VALUES
((SELECT id FROM posts WHERE title = 'Database Design Fundamentals' LIMIT 1), 'Normalization is so important but often overlooked. Great explanation here!', NOW() - INTERVAL '5 days'),
((SELECT id FROM posts WHERE title = 'Database Design Fundamentals' LIMIT 1), 'When should you denormalize? I know it''s sometimes necessary for performance.', NOW() - INTERVAL '4 days');

-- Comments for Post 6 (Digital Marketing Strategies)
INSERT INTO comments (post_id, text, timestamp) VALUES
((SELECT id FROM posts WHERE title = 'Digital Marketing Strategies for 2024' LIMIT 1), 'AI in marketing is game-changing. We''ve seen amazing results with personalized content.', NOW() - INTERVAL '1 day'),
((SELECT id FROM posts WHERE title = 'Digital Marketing Strategies for 2024' LIMIT 1), 'Social media ROI is so hard to measure. Do you have any tools you recommend?', NOW() - INTERVAL '12 hours');

-- Comments for Post 7 (Content Marketing)
INSERT INTO comments (post_id, text, timestamp) VALUES
((SELECT id FROM posts WHERE title = 'Content Marketing: Creating Engaging Content' LIMIT 1), 'Storytelling makes such a difference. Our engagement rates doubled when we started focusing on narratives.', NOW() - INTERVAL '7 days'),
((SELECT id FROM posts WHERE title = 'Content Marketing: Creating Engaging Content' LIMIT 1), 'What''s the best content format for B2B marketing?', NOW() - INTERVAL '6 days'),
((SELECT id FROM posts WHERE title = 'Content Marketing: Creating Engaging Content' LIMIT 1), 'Great tips! Video content has been working really well for us too.', NOW() - INTERVAL '5 days');

-- Comments for Post 8 (Clean Code Principles)
INSERT INTO comments (post_id, text, timestamp) VALUES
((SELECT id FROM posts WHERE title = 'Clean Code Principles: Writing Maintainable Software' LIMIT 1), 'SOLID principles changed how I code. This is a must-read for all developers!', NOW() - INTERVAL '20 hours'),
((SELECT id FROM posts WHERE title = 'Clean Code Principles: Writing Maintainable Software' LIMIT 1), 'Refactoring legacy code is so challenging. Any specific strategies?', NOW() - INTERVAL '18 hours'),
((SELECT id FROM posts WHERE title = 'Clean Code Principles: Writing Maintainable Software' LIMIT 1), 'Naming things is one of the hardest problems in computer science!', NOW() - INTERVAL '16 hours');

-- Comments for Post 9 (Git Version Control)
INSERT INTO comments (post_id, text, timestamp) VALUES
((SELECT id FROM posts WHERE title = 'Version Control with Git: Essential Commands' LIMIT 1), 'Git rebase vs merge - when do you use which?', NOW() - INTERVAL '8 days'),
((SELECT id FROM posts WHERE title = 'Version Control with Git: Essential Commands' LIMIT 1), 'Learning Git was one of the best decisions I made. Great resource!', NOW() - INTERVAL '7 days');

-- Comments for Post 10 (Python for Data Science)
INSERT INTO comments (post_id, text, timestamp) VALUES
((SELECT id FROM posts WHERE title = 'Python for Data Science: Pandas and NumPy Basics' LIMIT 1), 'Pandas is incredibly powerful. Took me a while to master groupby but it''s worth it!', NOW() - INTERVAL '9 days'),
((SELECT id FROM posts WHERE title = 'Python for Data Science: Pandas and NumPy Basics' LIMIT 1), 'Do you recommend any specific courses or resources to go deeper?', NOW() - INTERVAL '8 days'),
((SELECT id FROM posts WHERE title = 'Python for Data Science: Pandas and NumPy Basics' LIMIT 1), 'NumPy arrays are so much faster than regular Python lists for numerical operations.', NOW() - INTERVAL '7 days'),
((SELECT id FROM posts WHERE title = 'Python for Data Science: Pandas and NumPy Basics' LIMIT 1), 'This helped me get started with my data analysis project. Thank you!', NOW() - INTERVAL '6 days');

