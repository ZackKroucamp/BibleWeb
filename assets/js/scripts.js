    //    // Simulated Database - In production, this would connect to actual SQLite database
    //     const database = {
    //         users: [
    //             {
    //                 user_id: 1,
    //                 username: 'admin',
    //                 password: 'admin123',
    //                 email: 'admin@shalomscripture.com',
    //                 first_name: 'System',
    //                 last_name: 'Administrator',
    //                 phone: '+1-555-0001',
    //                 address: '123 Bible Way',
    //                 city: 'Jerusalem',
    //                 state: 'Holy Land',
    //                 zip_code: '12345',
    //                 country: 'USA',
    //                 is_active: true,
    //                 last_login: null
    //             },
    //             {
    //                 user_id: 2,
    //                 username: 'scholar',
    //                 password: 'study456',
    //                 email: 'scholar@shalomscripture.com',
    //                 first_name: 'Dr. Sarah',
    //                 last_name: 'Thompson',
    //                 phone: '+1-555-0002',
    //                 address: '456 Study Lane',
    //                 city: 'Seminary City',
    //                 state: 'TX',
    //                 zip_code: '78901',
    //                 country: 'USA',
    //                 is_active: true,
    //                 last_login: null
    //             },
    //             {
    //                 user_id: 3,
    //                 username: 'student',
    //                 password: 'learn789',
    //                 email: 'student@shalomscripture.com',
    //                 first_name: 'John',
    //                 last_name: 'Disciple',
    //                 phone: '+1-555-0003',
    //                 address: '789 Learning St',
    //                 city: 'Faith Valley',
    //                 state: 'CA',
    //                 zip_code: '90210',
    //                 country: 'USA',
    //                 is_active: true,
    //                 last_login: null
    //             },
    //             {
    //                 user_id: 4,
    //                 username: 'teacher',
    //                 password: 'teach321',
    //                 email: 'teacher@shalomscripture.com',
    //                 first_name: 'Pastor',
    //                 last_name: 'Matthew',
    //                 phone: '+1-555-0004',
    //                 address: '321 Teaching Ave',
    //                 city: 'Gospel Town',
    //                 state: 'GA',
    //                 zip_code: '30309',
    //                 country: 'USA',
    //                 is_active: true,
    //                 last_login: null
    //             }
    //         ],
            
    //         user_rights: [
    //             { right_id: 1, right_name: 'view_bible_versions', right_description: 'Access to multiple Bible translations' },
    //             { right_id: 2, right_name: 'view_interlinear', right_description: 'Access to interlinear Bible study tools' },
    //             { right_id: 3, right_name: 'view_maps', right_description: 'Access to biblical maps and geography' },
    //             { right_id: 4, right_name: 'view_family_tree', right_description: 'Access to biblical genealogies' },
    //             { right_id: 5, right_name: 'view_recipes', right_description: 'Access to biblical recipes' },
    //             { right_id: 6, right_name: 'view_languages', right_description: 'Access to Hebrew, Greek, Aramaic lessons' },
    //             { right_id: 7, right_name: 'view_shabbat', right_description: 'Access to weekly Shabbat portions' },
    //             { right_id: 8, right_name: 'admin_users', right_description: 'Manage user accounts and permissions' },
    //             { right_id: 9, right_name: 'admin_content', right_description: 'Manage website content' },
    //             { right_id: 10, right_name: 'admin_system', right_description: 'Full system administration access' }
    //         ],
            
    //         user_roles: [
    //             { role_id: 1, role_name: 'student', role_description: 'Basic access to study materials' },
    //             { role_id: 2, role_name: 'scholar', role_description: 'Advanced access to research tools' },
    //             { role_id: 3, role_name: 'teacher', role_description: 'Access to teaching resources and advanced tools' },
    //             { role_id: 4, role_name: 'admin', role_description: 'Full administrative access' }
    //         ],
            
    //         role_rights: [
    //             // Student role - basic access
    //             { role_id: 1, right_id: 1 }, // view_bible_versions
    //             { role_id: 1, right_id: 5 }, // view_recipes
    //             { role_id: 1, right_id: 7 }, // view_shabbat
                
    //             // Scholar role - research access
    //             { role_id: 2, right_id: 1 }, // view_bible_versions
    //             { role_id: 2, right_id: 2 }, // view_interlinear
    //             { role_id: 2, right_id: 3 }, // view_maps
    //             { role_id: 2, right_id: 4 }, // view_family_tree
    //             { role_id: 2, right_id: 5 }, // view_recipes
    //             { role_id: 2, right_id: 6 }, // view_languages
    //             { role_id: 2, right_id: 7 }, // view_shabbat
                
    //             // Teacher role - teaching tools
    //             { role_id: 3, right_id: 1 }, // view_bible_versions
    //             { role_id: 3, right_id: 2 }, // view_interlinear
    //             { role_id: 3, right_id: 3 }, // view_maps
    //             { role_id: 3, right_id: 4 }, // view_family_tree
    //             { role_id: 3, right_id: 5 }, // view_recipes
    //             { role_id: 3, right_id: 6 }, // view_languages
    //             { role_id: 3, right_id: 7 }, // view_shabbat
    //             { role_id: 3, right_id: 9 }, // admin_content
                
    //             // Admin role - full access
    //             { role_id: 4, right_id: 1 }, { role_id: 4, right_id: 2 }, { role_id: 4, right_id: 3 },
    //             { role_id: 4, right_id: 4 }, { role_id: 4, right_id: 5 }, { role_id: 4, right_id: 6 },
    //             { role_id: 4, right_id: 7 }, { role_id: 4, right_id: 8 }, { role_id: 4, right_id: 9 },
    //             { role_id: 4, right_id: 10 }
    //         ],
            
    //         user_role_assignments: [
    //             { user_id: 1, role_id: 4 }, // admin gets admin role
    //             { user_id: 2, role_id: 2 }, // scholar gets scholar role
    //             { user_id: 3, role_id: 1 }, // student gets student role
    //             { user_id: 4, role_id: 3 }  // teacher gets teacher role
    //         ]
    //     };

    //     // Database helper functions
    //     function authenticateUser(username, password) {
    //         const user = database.users.find(u => 
    //             u.username === username && 
    //             u.password === password && 
    //             u.is_active
    //         );
            
    //         if (user) {
    //             // Update last login
    //             user.last_login = new Date().toISOString();
    //             return {
    //                 success: true,
    //                 user: {
    //                     user_id: user.user_id,
    //                     username: user.username,
    //                     email: user.email,
    //                     first_name: user.first_name,
    //                     last_name: user.last_name,
    //                     full_name: `${user.first_name} ${user.last_name}`
    //                 }
    //             };
    //         }
            
    //         return { success: false, message: 'Invalid credentials' };
    //     }

    //     function getUserPermissions(userId) {
    //         // Get user's role
    //         const userRole = database.user_role_assignments.find(ura => ura.user_id === userId);
    //         if (!userRole) return [];
            
    //         // Get role's rights
    //         const roleRights = database.role_rights.filter(rr => rr.role_id === userRole.role_id);
    //         const rightIds = roleRights.map(rr => rr.right_id);
            
    //         // Get right details
    //         return database.user_rights.filter(ur => rightIds.includes(ur.right_id));
    //     }

    //     function hasPermission(userId, rightName) {
    //         const permissions = getUserPermissions(userId);
    //         return permissions.some(p => p.right_name === rightName);
    //     }

    //     function getUserRole(userId) {
    //         const userRoleAssignment = database.user_role_assignments.find(ura => ura.user_id === userId);
    //         if (!userRoleAssignment) return null;
            
    //         return database.user_roles.find(ur => ur.role_id === userRoleAssignment.role_id);
    //     }

        // Current user state
        // let currentUser = null;
        // let userPermissions = [];

        // function showHome() {
        //     // Hide all content areas
        //     document.querySelectorAll('.content-area').forEach(area => {
        //         area.classList.remove('active');
        //     });
        //     // Show main content
        //     document.getElementById('main-content').style.display = 'block';
        // }

        // function showPage(pageId) {
        //     // Check permissions before showing page
        //     const permissionMap = {
        //         'bible-versions': 'view_bible_versions',
        //         'interlinear': 'view_interlinear',
        //         'maps': 'view_maps',
        //         'family-tree': 'view_family_tree',
        //         'recipes': 'view_recipes',
        //         'languages': 'view_languages',
        //         'shabbat': 'view_shabbat'
        //     };
            
        //     if (permissionMap[pageId] && !hasPermission(currentUser.user_id, permissionMap[pageId])) {
        //         alert('Access Denied: You do not have permission to view this section.');
        //         return;
        //     }
            
        //     // Hide main content
        //     document.getElementById('main-content').style.display = 'none';
        //     // Hide all content areas
        //     document.querySelectorAll('.content-area').forEach(area => {
        //         area.classList.remove('active');
        //     });
        //     // Show selected page
        //     document.getElementById(pageId).classList.add('active');
            
        //     // Close mobile menu if open
        //     document.getElementById('nav-menu').classList.remove('show');
        // }

        // function handleLogin(event) {
        //     event.preventDefault();
        //     const username = document.getElementById('username-input').value;
        //     const password = document.getElementById('password-input').value;

        //     const authResult = authenticateUser(username, password);
            
        //     if (authResult.success) {
        //         currentUser = authResult.user;
        //         userPermissions = getUserPermissions(currentUser.user_id);
        //         const userRole = getUserRole(currentUser.user_id);
                
        //         // Update UI
        //         // document.getElementById('username').textContent = currentUser.full_name;
                
        //         // Hide login page and show main content
        //         document.getElementById('login-page').style.display = 'none';
        //         document.getElementById('main-header').style.display = 'block';
        //         document.getElementById('main-content').style.display = 'block';
        //         document.getElementById('user-info').style.display = 'block';
                
        //         // Apply permission-based UI restrictions
        //         applyPermissionRestrictions();
                
        //         // Clear form
        //         document.getElementById('username-input').value = '';
        //         document.getElementById('password-input').value = '';
                
        //         // Show welcome message with role
        //         setTimeout(() => {
        //             alert(`Welcome, ${currentUser.full_name}!\nRole: ${userRole ? userRole.role_name : 'No role assigned'}\nEmail: ${currentUser.email}`);
        //         }, 500);
                
        //     } else {
        //         alert('Invalid credentials. Please try again.');
        //     }
        // }

        function applyPermissionRestrictions() {
            // Hide navigation items based on permissions
            const navItems = {
                'bible-versions': 'view_bible_versions',
                'interlinear': 'view_interlinear',
                'maps': 'view_maps',
                'family-tree': 'view_family_tree',
                'recipes': 'view_recipes',
                'languages': 'view_languages',
                'shabbat': 'view_shabbat'
            };
            
            // Hide feature cards based on permissions
            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach((card, index) => {
                const pageIds = Object.keys(navItems);
                if (index < pageIds.length) {
                    const permission = navItems[pageIds[index]];
                    if (!hasPermission(currentUser.user_id, permission)) {
                        card.style.opacity = '0.5';
                        card.style.cursor = 'not-allowed';
                        card.onclick = () => alert('Access Denied: Insufficient permissions');
                    }
                }
            });
        }

        function logout() {
            window.location.href = 'api/logout.php';
        }

                
        function showHome() {
            window.location.href = '/bibleweb/';
        }

        function biblereader() {
            window.location.href = '/bibleweb/modules/biblereader.php';
        }
        function familytree() {
            window.location.href = '/bibleweb/modules/familytree.php';
        }
        function shabbat() {
            window.location.href = '/bibleweb/modules/shabbat.php';
        }
        function interlinear() {
            window.location.href = '/bibleweb/modules/interlinear.php';
        }
        function recipes() {
            window.location.href = '/bibleweb/modules/recipes.php';
        }
        function toggleMobileMenu() {
            document.getElementById('nav-menu').classList.toggle('show');
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const nav = document.getElementById('nav-menu');
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (!nav.contains(event.target) && !toggle.contains(event.target)) {
                nav.classList.remove('show');
            }
        });

        // Add smooth scrolling effect to header
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (header && header.style.display !== 'none') {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(15, 23, 42, 0.98)';
                } else {
                    header.style.background = 'rgba(15, 23, 42, 0.95)';
                }
            }
        });

        // // Bible Reader Functions
        // function loadBibleVersions() {
        //     const versionSelect = document.getElementById('bible-version');
        //     versionSelect.innerHTML = '<option value="">Loading versions...</option>';
            
        //     fetch('api.php?action=get_versions')
        //         .then(response => response.json())
        //         .then(data => {
        //             if (data.success) {
        //                 versionSelect.innerHTML = '<option value="">Select Version</option>';
        //                 data.data.forEach(version => {
        //                     const option = document.createElement('option');
        //                     option.value = version.code;
        //                     option.textContent = version.name;
        //                     versionSelect.appendChild(option);
        //                 });
        //             } else {
        //                 document.getElementById('bible-error').textContent = data.error;
        //                 document.getElementById('bible-error').style.display = 'block';
        //             }
        //         })
        //         .catch(error => {
        //             document.getElementById('bible-error').textContent = 'Failed to load Bible versions: ' + error.message;
        //             document.getElementById('bible-error').style.display = 'block';
        //         });
        // }

        // function loadBibleVersion() {
        //     const version = document.getElementById('bible-version').value;
        //     if (!version) return;
            
        //     const bookSelect = document.getElementById('bible-book');
        //     bookSelect.innerHTML = '<option value="">Loading books...</option>';
            
        //     fetch(`api.php?action=get_books&version=${version}`)
        //         .then(response => response.json())
        //         .then(data => {
        //             if (data.success) {
        //                 bookSelect.innerHTML = '<option value="">Select Book</option>';
        //                 data.data.forEach(book => {
        //                     const option = document.createElement('option');
        //                     option.value = book.number;
        //                     option.textContent = book.name;
        //                     bookSelect.appendChild(option);
        //                 });
                        
        //                 // Reset chapter and verses
        //                 document.getElementById('bible-chapter').innerHTML = '<option value="">Select Chapter</option>';
        //                 document.getElementById('bible-verses').innerHTML = '<div style="text-align: center; color: #6b7280; padding: 3rem;">Select a book and chapter to begin reading.</div>';
        //                 document.getElementById('chapter-title').style.display = 'none';
        //                 document.getElementById('verse-navigation').style.display = 'none';
        //                 document.getElementById('bible-info').style.display = 'none';
        //             } else {
        //                 document.getElementById('bible-error').textContent = data.error;
        //                 document.getElementById('bible-error').style.display = 'block';
        //             }
        //         })
        //         .catch(error => {
        //             document.getElementById('bible-error').textContent = 'Failed to load Bible books: ' + error.message;
        //             document.getElementById('bible-error').style.display = 'block';
        //         });
        // }

        // function loadChapters() {
        //     const version = document.getElementById('bible-version').value;
        //     const book = document.getElementById('bible-book').value;
        //     if (!version || !book) return;
            
        //     const bookName = document.getElementById('bible-book').options[document.getElementById('bible-book').selectedIndex].text;
        //     const chapterSelect = document.getElementById('bible-chapter');
        //     chapterSelect.innerHTML = '<option value="">Loading chapters...</option>';
            
        //     fetch(`api.php?action=get_chapters&version=${version}&book=${book}`)
        //         .then(response => response.json())
        //         .then(data => {
        //             if (data.success) {
        //                 chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
        //                 data.data.forEach(chapter => {
        //                     const option = document.createElement('option');
        //                     option.value = chapter;
        //                     option.textContent = chapter;
        //                     chapterSelect.appendChild(option);
        //                 });
                        
        //                 // Reset verses
        //                 document.getElementById('bible-verses').innerHTML = '<div style="text-align: center; color: #6b7280; padding: 3rem;">Select a chapter to view verses.</div>';
        //                 document.getElementById('chapter-title').style.display = 'none';
        //                 document.getElementById('verse-navigation').style.display = 'none';
        //                 document.getElementById('bible-info').style.display = 'none';
        //             } else {
        //                 document.getElementById('bible-error').textContent = data.error;
        //                 document.getElementById('bible-error').style.display = 'block';
        //             }
        //         })
        //         .catch(error => {
        //             document.getElementById('bible-error').textContent = 'Failed to load chapters: ' + error.message;
        //             document.getElementById('bible-error').style.display = 'block';
        //         });
        // }

        // function loadVerses() {
        //     const version = document.getElementById('bible-version').value;
        //     const book = document.getElementById('bible-book').value;
        //     const chapter = document.getElementById('bible-chapter').value;
        //     if (!version || !book || !chapter) return;
            
        //     const bookName = document.getElementById('bible-book').options[document.getElementById('bible-book').selectedIndex].text;
        //     const versionName = document.getElementById('bible-version').options[document.getElementById('bible-version').selectedIndex].text;
            
        //     // Show loading indicator
        //     document.getElementById('bible-loading').style.display = 'block';
        //     document.getElementById('bible-verses').innerHTML = '';
        //     document.getElementById('bible-error').style.display = 'none';
            
        //     // Load verses
        //     fetch(`api.php?action=get_verses&version=${version}&book=${book}&chapter=${chapter}`)
        //         .then(response => response.json())
        //         .then(data => {
        //             document.getElementById('bible-loading').style.display = 'none';
                    
        //             if (data.success) {
        //                 // Update chapter title
        //                 const chapterTitle = document.getElementById('chapter-title');
        //                 chapterTitle.textContent = `${bookName} ${chapter}`;
        //                 chapterTitle.style.display = 'block';
                        
        //                 // Display verses
        //                 const versesContainer = document.getElementById('bible-verses');
        //                 versesContainer.innerHTML = '';
                        
        //                 data.data.forEach(verse => {
        //                     const verseElement = document.createElement('div');
        //                     verseElement.style.marginBottom = '1rem';
        //                     verseElement.innerHTML = `
        //                         <sup style="color: #3b82f6; font-weight: bold;">${verse.verse}</sup> 
        //                         <span>${verse.text}</span>
        //                     `;
        //                     versesContainer.appendChild(verseElement);
        //                 });
                        
        //                 // Show verse navigation
        //                 document.getElementById('verse-navigation').style.display = 'block';
                        
        //                 // Load verse count for navigation
        //                 loadVerseCount(version, book, chapter);
                        
        //                 // Show Bible info
        //                 const bibleInfo = document.getElementById('bible-info');
        //                 bibleInfo.style.display = 'block';
        //                 document.getElementById('bible-details').innerHTML = `
        //                     <p><strong>Version:</strong> ${versionName}</p>
        //                     <p><strong>Book:</strong> ${bookName}</p>
        //                     <p><strong>Chapter:</strong> ${chapter}</p>
        //                     <p><strong>Verses:</strong> ${data.data.length}</p>
        //                 `;
        //             } else {
        //                 document.getElementById('bible-error').textContent = data.error;
        //                 document.getElementById('bible-error').style.display = 'block';
        //             }
        //         })
        //         .catch(error => {
        //             document.getElementById('bible-loading').style.display = 'none';
        //             document.getElementById('bible-error').textContent = 'Failed to load verses: ' + error.message;
        //             document.getElementById('bible-error').style.display = 'block';
        //         });
        // }

        // function loadVerseCount(version, book, chapter) {
        //     fetch(`api.php?action=get_verse_count&version=${version}&book=${book}&chapter=${chapter}`)
        //         .then(response => response.json())
        //         .then(data => {
        //             if (data.success) {
        //                 // Store the verse count for navigation
        //                 window.currentVerseCount = data.data.count;
        //             }
        //         });
        // }

        // function nextChapter() {
        //     const version = document.getElementById('bible-version').value;
        //     const book = document.getElementById('bible-book').value;
        //     const currentChapter = parseInt(document.getElementById('bible-chapter').value);
            
        //     if (!version || !book || isNaN(currentChapter)) return;
            
        //     // Check if there's a next chapter
        //     const chapterSelect = document.getElementById('bible-chapter');
        //     const nextChapterOption = Array.from(chapterSelect.options).find(
        //         option => parseInt(option.value) > currentChapter
        //     );
            
        //     if (nextChapterOption) {
        //         chapterSelect.value = nextChapterOption.value;
        //         loadVerses();
        //     } else {
        //         // If no next chapter in this book, try next book
        //         const bookSelect = document.getElementById('bible-book');
        //         const nextBookOption = Array.from(bookSelect.options).find(
        //             option => parseInt(option.value) > parseInt(book)
        //         );
                
        //         if (nextBookOption) {
        //             bookSelect.value = nextBookOption.value;
        //             loadChapters();
                    
        //             // After a short delay, select first chapter of next book
        //             setTimeout(() => {
        //                 const chapterSelect = document.getElementById('bible-chapter');
        //                 if (chapterSelect.options.length > 1) {
        //                     chapterSelect.value = chapterSelect.options[1].value;
        //                     loadVerses();
        //                 }
        //             }, 300);
        //         }
        //     }
        // }

        // function previousChapter() {
        //     const version = document.getElementById('bible-version').value;
        //     const book = document.getElementById('bible-book').value;
        //     const currentChapter = parseInt(document.getElementById('bible-chapter').value);
            
        //     if (!version || !book || isNaN(currentChapter)) return;
            
        //     // Check if there's a previous chapter
        //     const chapterSelect = document.getElementById('bible-chapter');
        //     const prevChapterOption = Array.from(chapterSelect.options).reverse().find(
        //         option => parseInt(option.value) < currentChapter
        //     );
            
        //     if (prevChapterOption) {
        //         chapterSelect.value = prevChapterOption.value;
        //         loadVerses();
        //     } else {
        //         // If no previous chapter in this book, try previous book
        //         const bookSelect = document.getElementById('bible-book');
        //         const prevBookOption = Array.from(bookSelect.options).reverse().find(
        //             option => parseInt(option.value) < parseInt(book)
        //         );
                
        //         if (prevBookOption) {
        //             bookSelect.value = prevBookOption.value;
        //             loadChapters();
                    
        //             // After a short delay, select last chapter of previous book
        //             setTimeout(() => {
        //                 const chapterSelect = document.getElementById('bible-chapter');
        //                 if (chapterSelect.options.length > 1) {
        //                     chapterSelect.value = chapterSelect.options[chapterSelect.options.length - 1].value;
        //                     loadVerses();
        //                 }
        //             }, 300);
        //         }
        //     }
        // }

        // // Initialize Bible reader when page loads
        // document.addEventListener('DOMContentLoaded', function() {
        //     loadBibleVersions();
            
        //     // Add event listeners for keyboard navigation
        //     document.addEventListener('keydown', function(e) {
        //         if (e.key === 'ArrowRight') {
        //             nextChapter();
        //         } else if (e.key === 'ArrowLeft') {
        //             previousChapter();
        //         }
        //     });
            
        //     // Add event listeners for dropdown changes
        //     document.getElementById('bible-version').addEventListener('change', loadBibleVersion);
        //     document.getElementById('bible-book').addEventListener('change', loadChapters);
        //     document.getElementById('bible-chapter').addEventListener('change', loadVerses);
        // });