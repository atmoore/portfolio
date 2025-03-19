// Enhanced Category Filtering Functionality with No Delay
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.category-filter');
  const projectCards = document.querySelectorAll('.project-card');
  const filterContainer = document.querySelector('.project-filters-container');
  let activeCategory = 'all'; // Default active category

  // IMPORTANT: Remove any existing counters to prevent duplicates
  document.querySelectorAll('.filter-counter').forEach(counter => {
    counter.remove();
  });
  
  // Filter counter
  const createCounter = () => {
    const counter = document.createElement('span');
    counter.className = 'filter-counter ml-2';
    counter.textContent = projectCards.length;
    
    // Find the "All" filter button and append counter
    const allButton = document.querySelector('.category-filter[data-category="all"]');
    if (allButton && !allButton.querySelector('.filter-counter')) {
      allButton.appendChild(counter);
    }
  };
  
  // Initialize counters for each category
  const initCategoryCounts = () => {
    // First create and add counter for "All"
    createCounter();
    
    // Create counters for each category
    filterButtons.forEach(button => {
      if (button.dataset.category !== 'all') {
        const category = button.dataset.category;
        let count = 0;
        
        // Count projects in this category
        projectCards.forEach(card => {
          const categories = card.dataset.categories ? card.dataset.categories.split(',') : [];
          if (categories.includes(category)) {
            count++;
          }
        });
        
        // Only add counter if there are projects in this category
        if (count > 0) {
          const counter = document.createElement('span');
          counter.className = 'filter-counter';
          counter.textContent = count;
          button.appendChild(counter);
        }
      }
    });
  };
  
  // Filter projects by category - NO DELAY VERSION
  const filterProjects = (category) => {
    // Update active button
    filterButtons.forEach(btn => {
      if (btn.dataset.category === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Show/hide projects based on category - NO DELAY
    projectCards.forEach(card => {
      if (category === 'all') {
        // Show all projects immediately
        card.classList.remove('hidden-card');
        card.style.display = '';
      } else {
        const cardCategories = card.dataset.categories ? card.dataset.categories.split(',') : [];
        
        if (cardCategories.includes(category)) {
          // Show this project immediately
          card.classList.remove('hidden-card');
          card.style.display = '';
        } else {
          // Hide this project immediately
          card.classList.add('hidden-card');
          card.style.display = 'none';
        }
      }
    });
    
    // Save active category
    activeCategory = category;
    
    // Update URL hash for bookmarking WITHOUT scrolling the page
    if (category === 'all') {
      // Instead of changing window.location.hash (which causes scroll)
      // Use history.replaceState to update the URL without scrolling
      const url = window.location.pathname + window.location.search;
      history.replaceState(null, '', url);
    } else {
      // For other categories, still update the hash but prevent scrolling
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      window.location.hash = category;
      window.scrollTo(0, scrollPosition);
    }
  };
  
  // Add click event listeners to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      filterProjects(category);
    });
  });
  
  // Initialize category counts
  initCategoryCounts();
  
  // Initialize with all projects shown
  // Use setTimeout to allow the page to load first
  setTimeout(() => {
    // Only apply filter based on hash if there is one
    if (window.location.hash) {
      checkUrlForFilter();
    } else {
      filterProjects('all');
    }
  }, 100);
  
  // Add URL handling for direct links to filtered views
  const checkUrlForFilter = () => {
    if (window.location.hash) {
      const category = window.location.hash.substring(1); // Remove the # character
      const validCategories = Array.from(filterButtons).map(btn => btn.dataset.category);
      
      if (validCategories.includes(category)) {
        filterProjects(category);
      }
    }
  };
  
  // Update URL when filter changes
  window.addEventListener('hashchange', checkUrlForFilter);
  
  // Prevent default hash behavior for category links
  document.querySelectorAll('.category-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
});