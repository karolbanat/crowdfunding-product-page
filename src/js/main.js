/* nav elements */
const toggleBtn = document.querySelector('.toggle-button');
const primaryNav = document.querySelector('#primary-nav');

/* toggle nav button handling */
const handleToggleBtn = () => {
	toggleBtn.toggleAttribute('data-expanded');
	const expanded = toggleBtn.hasAttribute('data-expanded');
	primaryNav.toggleAttribute('data-expanded', expanded);
	toggleBtn.setAttribute('aria-expanded', expanded);
};

toggleBtn.addEventListener('click', handleToggleBtn);
