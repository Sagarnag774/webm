// Form handling for all pages
function initializeVolunteerForm() {
    handleFormSubmit(
        'volunteerForm',
        '/volunteers',
        'Thank you for volunteering! We appreciate your help and will be in touch soon.'
    );
}

function initializeDonationForm() {
    handleFormSubmit(
        'donationForm',
        '/donations',
        'Thank you for your donation interest! We will contact you with payment details.'
    );
    
    setupDonationForm();
}

function setupDonationForm() {
    const donationAmount = document.getElementById('donationAmount');
    const customAmountContainer = document.getElementById('customAmountContainer');
    const dedication = document.getElementById('dedication');
    const dedicationNameContainer = document.getElementById('dedicationNameContainer');
    
    if (donationAmount && customAmountContainer) {
        donationAmount.addEventListener('change', function() {
            customAmountContainer.style.display = this.value === 'other' ? 'block' : 'none';
        });
    }
    
    if (dedication && dedicationNameContainer) {
        dedication.addEventListener('change', function() {
            dedicationNameContainer.style.display = this.value ? 'block' : 'none';
        });
    }
}

async function loadStories() {
    try {
        const stories = await apiCall('/stories');
        currentStories = stories;
        renderStories(stories);
    } catch (error) {
        console.error('Error loading stories:', error);
        const sampleStories = getSampleStories();
        currentStories = sampleStories;
        renderStories(sampleStories);
    }
}

function renderStories(stories) {
    const storiesGrid = document.getElementById('storiesGrid');
    if (!storiesGrid) return;
    
    storiesGrid.innerHTML = '';
    
    if (stories.length === 0) {
        storiesGrid.innerHTML = '<div class="no-stories">No success stories available yet. Check back soon!</div>';
        return;
    }
    
    stories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.innerHTML = `
            <img src="${story.image}" alt="${story.petName} with ${story.ownerName}" class="story-image" onerror="this.src='https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80'">
            <div class="story-content">
                <h3>${story.petName}'s Story</h3>
                <p class="story-quote">"${story.story}"</p>
                <p class="story-author">- ${story.ownerName}</p>
                ${story.adoptionDate ? `<small>Adopted on ${new Date(story.adoptionDate).toLocaleDateString()}</small>` : ''}
            </div>
        `;
        storiesGrid.appendChild(storyCard);
    });
}

function initializeStoryForm() {
    const form = document.getElementById('successStoryForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loading"></div> Sharing...';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert('Thank you for sharing your story! We may contact you for more details.');
            form.reset();
            
        } catch (error) {
            alert('There was an error sharing your story. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

async function loadBlogPosts() {
    try {
        const posts = await apiCall('/blog');
        currentBlogPosts = posts;
        renderBlogPosts(posts);
    } catch (error) {
        console.error('Error loading blog posts:', error);
        const samplePosts = getSampleBlogPosts();
        currentBlogPosts = samplePosts;
        renderBlogPosts(samplePosts);
    }
}

function renderBlogPosts(posts) {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return;
    
    blogGrid.innerHTML = '';
    
    if (posts.length === 0) {
        blogGrid.innerHTML = '<div class="no-posts">No blog posts available yet. Check back soon!</div>';
        return;
    }
    
    posts.forEach(post => {
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card';
        blogCard.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="blog-image" onerror="this.src='https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1150&q=80'">
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${post.category}</span>
                    <span class="blog-date">${new Date(post.date).toLocaleDateString()} • ${post.readTime}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="#" class="btn btn-secondary">Read More</a>
            </div>
        `;
        blogGrid.appendChild(blogCard);
    });
}

function initializeNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<div class="loading"></div> Subscribing...';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert('Thank you for subscribing to our newsletter!');
            form.reset();
            
        } catch (error) {
            alert('There was an error subscribing. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// Sample data functions
function getSampleStories() {
    return [
        {
            id: 1,
            petName: "Max",
            ownerName: "Sarah Johnson",
            story: "Max has brought so much joy to our family. He's the perfect companion for our evening walks and loves playing with our kids. Adopting him was the best decision we ever made!",
            image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80",
            adoptionDate: "2023-06-15"
        },
        {
            id: 2,
            petName: "Luna",
            ownerName: "Michael Chen",
            story: "Luna was shy at first, but she's blossomed into the most affectionate cat. She loves curling up on my lap while I work and has become an integral part of our home.",
            image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=694&q=80",
            adoptionDate: "2023-05-20"
        }
    ];
}

function getSampleBlogPosts() {
    return [
        {
            id: 1,
            title: "How to Prepare Your Home for a New Pet",
            excerpt: "Getting ready to welcome a new furry friend? Here's everything you need to know to prepare your home, from pet-proofing to essential supplies.",
            date: "2023-10-15",
            image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1150&q=80",
            category: "Pet Care",
            readTime: "5 min read"
        },
        {
            id: 2,
            title: "Understanding Pet Vaccinations: A Complete Guide",
            excerpt: "A comprehensive guide to pet vaccinations - what they are, when they're needed, and why they're crucial for your pet's health.",
            date: "2023-10-08",
            image: "https://images.unsplash.com/photo-1583512603806-077998240c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1158&q=80",
            category: "Health & Wellness",
            readTime: "8 min read"
        }
    ];
}