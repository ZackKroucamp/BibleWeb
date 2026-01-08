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