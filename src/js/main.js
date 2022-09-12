/* nav elements */
const toggleBtn = document.querySelector('.toggle-button');
const primaryNav = document.querySelector('#primary-nav');

/* bookmark */
const bookmarkButton = document.querySelector('.bookmark-button');
/* progress */
const totalAmountBacked = document.querySelector('#total-amount-backed');
const totalBackers = document.querySelector('#total-backers');
const progressBar = document.querySelector('#progress-bar');
/* pledge buttons - buttons in about section and header */
const pledgeButtons = document.querySelectorAll('button[data-reward]');
/* selection modal */
const selectionModal = document.querySelector('.selection-modal');
const closeSelectionModalButton = selectionModal.querySelector('.selection-modal__close-button');
/* pledge select radio buttons */
const selectionButtons = selectionModal.querySelectorAll('input[type="radio"][name="reward"]');
/* forms */
const pledgeForms = selectionModal.querySelectorAll('.pledge-form');
/* success modal */
const successModal = document.querySelector('.success-modal');
const successModalCloseButton = successModal.querySelector('.success-modal__confirmation-button');

const TOTAL_AMOUNT = 100000;
const PROGRESS_DATA = {
	amountBacked: 89914,
	backers: 5007,
};
const DATA_STATES = {
	expanded: 'data-expanded',
	bookmarked: 'data-bookmarked',
	open: 'data-open',
	selected: 'data-selected',
};

/* toggle nav button handling */
const handleToggleBtn = () => {
	toggleBtn.toggleAttribute(DATA_STATES.expanded);
	const expanded = toggleBtn.hasAttribute(DATA_STATES.expanded);
	primaryNav.toggleAttribute(DATA_STATES.expanded, expanded);
	toggleBtn.setAttribute('aria-expanded', expanded);
};

/* bookmark handling */
const handleBookmarkButton = () => {
	bookmarkButton.toggleAttribute(DATA_STATES.bookmarked);
	saveBookmarkData();
};

const saveBookmarkData = () => {
	const bookmarked = bookmarkButton.hasAttribute(DATA_STATES.bookmarked);
	localStorage.setItem('bookmarked', JSON.stringify(bookmarked));
};

const loadBookmarkData = () => {
	const bookmarked = JSON.parse(localStorage.getItem('bookmarked'));
	bookmarkButton.toggleAttribute(DATA_STATES.bookmarked, bookmarked);
};

/* pledge button handling */
const handlePledgeButton = (e) => {
	openSelectionModal();
	const reward = e.target.dataset.reward;
	selectChosenPledge(reward);
};

const openSelectionModal = () => {
	selectionModal.setAttribute(DATA_STATES.open, true);
};

const selectChosenPledge = (reward) => {
	/* find input with chosen reward */
	const query = `input[name="reward"][data-reward="${reward}"`;
	const selectedPledgeInput = selectionModal.querySelector(query);
	/* if found select it and parent card */
	if (selectedPledgeInput) {
		unselectAllCards();
		selectedPledgeInput.checked = true;
		selectParentCard(selectedPledgeInput);
	}
};

const closeSelectionModal = () => {
	selectionModal.removeAttribute(DATA_STATES.open);
};

const handlePledgeSelection = (e) => {
	unselectAllCards();
	selectParentCard(e.target);
};

const unselectAllCards = () => {
	selectionButtons.forEach((button) => button.closest('.modal-pledge-card').removeAttribute(DATA_STATES.selected));
};

const selectParentCard = (element) => {
	const parent = element.closest('.modal-pledge-card');
	if (parent) parent.setAttribute(DATA_STATES.selected, true);
};

/* form submitssion */
const handleFormSubmit = (e) => {
	e.preventDefault();
	const formInput = e.target.querySelector('input[type="number"]');
	const inputValue = formInput.value;
	updateProgressData(parseInt(inputValue));
	closeSelectionModal();
	openSuccessModal();
};

/* progress handling */
const updateProgressData = (value) => {
	PROGRESS_DATA.amountBacked += value;
	PROGRESS_DATA.backers += 1;
	saveProgressData();
	updateProgressBar();
	insertProgressData();
};

const saveProgressData = () => {
	localStorage.setItem('progress', JSON.stringify(PROGRESS_DATA));
};

const loadProgressData = () => {
	const progressData = JSON.parse(localStorage.getItem('progress'));
	if (progressData) {
		const { amountBacked, backers } = progressData;
		PROGRESS_DATA.amountBacked = amountBacked;
		PROGRESS_DATA.backers = backers;
	}
	insertProgressData();
};

const insertProgressData = () => {
	totalAmountBacked.innerText = formatAmount(PROGRESS_DATA.amountBacked);
	totalBackers.innerText = PROGRESS_DATA.backers.toLocaleString('en-US');
	updateProgressBar();
};

const updateProgressBar = () => {
	const progress = ((PROGRESS_DATA.amountBacked / TOTAL_AMOUNT) * 100).toFixed(2);
	progressBar.style.setProperty('--progress', `${progress}%`);
};

const formatAmount = (amount) => {
	return `$${amount.toLocaleString('en-US')}`;
};

/* success modal handling */
const openSuccessModal = () => {
	successModal.setAttribute(DATA_STATES.open, true);
};

const closeSuccessModal = () => {
	successModal.removeAttribute(DATA_STATES.open);
};

/* event listeners */
toggleBtn.addEventListener('click', handleToggleBtn);
bookmarkButton.addEventListener('click', handleBookmarkButton);
pledgeButtons.forEach((button) => {
	button.addEventListener('click', handlePledgeButton);
});
closeSelectionModalButton.addEventListener('click', closeSelectionModal);
selectionButtons.forEach((button) => {
	button.addEventListener('change', handlePledgeSelection);
});
pledgeForms.forEach((form) => {
	form.addEventListener('submit', handleFormSubmit);
});
successModalCloseButton.addEventListener('click', closeSuccessModal);

/* initial actions */
loadBookmarkData();
loadProgressData();
insertProgressData();
