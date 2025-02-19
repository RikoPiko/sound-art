/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

const { split } = require('lodash');

require('./bootstrap');
require('./aux1');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
	el: '#app',
	data: {
		/* PANNELS SHOW */
		searchHome : false,
		showCategoryPannel : false,
		showGenrePannel : false,
		showVotePannel : false,
		showAuthPannel : false,
		humburger : false,

		/*BUTTONS IN PAGINA SEARCH*/
		btnCategories : null,
		btnGeneres : null,
		btnVotes : null,

		//scroll per nav bar (per ora solo in search.blade)
		scrollPosition: null,
		scrollChange: 1200,

    //loader
    load_visible: true,

		//BASE URL CARDS
		base_url : null,

		// ARRAY CARDS 
		displayProfiles: [],
		groupCount : 0,
		start : 1,
		end : 24,
		groupLen : 24,
		more : false,
		showCards : false,
		resultsNotFound : false,
		
		// API FILTERS
		category_selected	: null,
		genre_selected		: null,
		vote_selected 		: null,
		reviewNum_selected	: null,
		onlySponsorship		: false,
		profile_num_start : null,
		profile_num_end : null,

		// INTERNAL APIs
		iper_profiles_url	: 'http://localhost:8000/api/profiles',
		iper_profiles		: [],
		is_last_profile_group : null,
	},
	methods: {
    //scroll! 
    updateScroll() {
      this.scrollPosition = window.scrollY
   }, //  fine scoll 
		showHumburger : function() {
			this.humburger = !this.humburger;
		},
		showSearch : function() {
			this.searchHome = !this.searchHome;		
		},
		showCategory: function() {
			this.showCategoryPannel = !this.showCategoryPannel;
			this.showGenrePannel = false;
			this.showVotePannel = false;
		},		
		showGenres: function() {
			this.showGenrePannel = !this.showGenrePannel;
			this.showCategoryPannel = false;
			this.showVotePannel = false;
		},
		showVotes: function() {
			this.showVotePannel = !this.showVotePannel;
			this.showCategoryPannel = false;
			this.showGenrePannel = false;
		},
		showAuth: function() {
			this.showAuthPannel = !this.showAuthPannel;
		},
		setCategory: function (category) {
			if(category === 'No filter') {
				this.category_selected = null;
			}
			else {
				this.category_selected = category;
			}
			this.btnCategories = category;
			this.showCategoryPannel = false;
		},
		setGenre: function (genre) {
			if(genre === 'No filter') {
				this.genre_selected = null;
			}
			else {
				this.genre_selected = genre;
			}
			this.btnGeneres = genre;
			this.showGenrePannel = false;
		},
		setVote: function (vote) {
			if(vote === 'No filter') {
				this.vote_selected = null;
			}
			else {
				this.vote_selected = vote;
			}
			this.btnVotes = vote;
			this.showVotePannel = false;	
		},
		stopProp: function(e) {
			e.stopPropagation();
		},
		wantToWork : function() {
			let wantToWork = [
				"BTS's songwriter ?", 
				"The Killers’ Mixing Engineer ?",
				"Beyonce’s Songwriter ?",
				"Jamiroquai’s Guitarist ?",
				"Joe Cocker’s Bass Player ?",
				"Morrissey’s Guitarist ?"
			]
			let startActive = 1;
			let activePhrase = document.getElementById('active-phrase');
			setInterval(function() {
				activePhrase.style.opacity = '0';
				setTimeout(function() {
					if(startActive == wantToWork.length) {
						startActive = 0;
					}
					activePhrase.innerHTML = wantToWork[startActive];
					activePhrase.style.opacity = '1';
					startActive++;
				}, 500);
			}, 3000);	
		},
		descriptionItem() {
			const descriptionsItems = document.getElementsByClassName('description-item');
			const descriptionImages = document.getElementsByClassName('description-img');
			const itemsLength = descriptionsItems.length;
			for(let i = 0; i < itemsLength; i++) {
				show(descriptionsItems[i], descriptionImages[i]);
				hide(descriptionsItems[i], descriptionImages[i]);
			}
			function show(hover, image) {
				hover.addEventListener('mouseover', function() {
					image.style.setProperty('opacity', '1');
					image.style.setProperty('z-index', '3');
				});
			}
			function hide(hover, image) {
				hover.addEventListener('mouseout', function() {
					image.style.setProperty('opacity', '0');
					image.style.setProperty('z-index', '0');
				});
			}
		},
		btnSubmit() {
			this.resultsNotFound = false;
			this.showCategoryPannel = false;
			this.showGenrePannel = false;
			this.showVotePannel = false;
			this.displayProfiles.length = 0;
			this.groupCount = 0;
			this.start = 1;
			this.end = 24;
			let createdAll = document.querySelectorAll("[class*='created-div']");
			for(let i = 0; i < createdAll.length; i++) {
				createdAll[i].remove();
			}
			this.filterCall();
		},
		btnShowMore() {	
			this.groupCount++;
			this.start += this.groupLen;
			this.end = this.start + this.groupLen - 1;
			this.more = true;
			this.filterCall();
		},
		buildHTML() {
			this.more = false;
			let counter = this.groupCount;
			let currentArray = this.displayProfiles[counter];
			// Row
			let row = document.getElementById('myrow');
			let arrayLength = currentArray.length;

			for(let i = 0; i < arrayLength; i++){

				// Col bootstrap
				let rowChild = document.createElement('div');
				rowChild.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'created-div');
				row.appendChild(rowChild);
	
					// Card cnt
					let cardCnt = document.createElement('div');
					cardCnt.classList.add('card-cnt');
					rowChild.appendChild(cardCnt);
	
						// Card Image container
						let cardImage = document.createElement('div');
						cardImage.classList.add('card-image');
						cardCnt.appendChild(cardImage);
	
							// Image
							let image = document.createElement('img');
							image.setAttribute('src', '../storage/' + currentArray[i]['image_url']);
							image.setAttribute('alt', 'Artist Image');
							cardImage.appendChild(image);

						// Card Content
						let cardContent = document.createElement('div');
						cardContent.classList.add('card-content');
						cardCnt.appendChild(cardContent);

							// Card title
							let cardTitle = document.createElement('div');
							cardTitle.classList.add('provided-card-title');
							cardContent.appendChild(cardTitle);

								// Categories href
								let linkCategories = document.createElement('a');
								linkCategories.classList.add('provided-categories');
								linkCategories.setAttribute('href', this.base_url + currentArray[i]['slug']);
								cardTitle.appendChild(linkCategories);

									// Title Categories
									let titleCategories = document.createElement('h3');
									linkCategories.appendChild(titleCategories);

										// Title text
										if(currentArray[i].hasOwnProperty('categories')) {
											let categoriesLength = currentArray[i]['categories'].length;
											for (let y = 0; y < categoriesLength; y++) {
												if (y > 3) break;
												else {
													let titleTextCnt = document.createElement('span');
													if(y < categoriesLength - 1 && y < 3) {
														titleTextCnt.innerHTML = '<span>' + currentArray[i]['categories'][y].toUpperCase() + '<span>' + ' /&nbsp' + '</span>' + '</span>';  
													}
													else {
														titleTextCnt.innerHTML = '<span>' + currentArray[i]['categories'][y].toUpperCase() + '</span>';
													}
													titleCategories.appendChild(titleTextCnt);
												}
											}
										}
									// Name href
									let linkName = document.createElement('a');
									linkName.classList.add('provided-name');
									linkName.setAttribute('href', this.base_url + currentArray[i]['slug']);
									linkName.innerHTML = '<span>' + currentArray[i]['name'] + ' ' + currentArray[i]['surname'] + '</span>';
									cardTitle.appendChild(linkName);

									//Work town
									let workTown = document.createElement('span');
									workTown.innerHTML = ', ' + currentArray[i]['work_town'];
									cardTitle.appendChild(workTown);
					
							// Vote
							let cardVoteCnt = document.createElement('div');
							cardVoteCnt.classList.add('vote');
								
								// Stars Container
								let stars = document.createElement('div');
								stars.classList.add('stars');
								cardVoteCnt.appendChild(stars);
								
									// Stars
									let cardVote = Math.round(currentArray[i]['average_vote']);
									for(let z = 0; z < cardVote; z++) {
										let fullStar = document.createElement('i');
										fullStar.classList.add('fas', 'fa-star', 'filled');
										stars.appendChild(fullStar);
									}
									if((5 - cardVote) > 0 ) {
										for(let z = 0; z < (5 - cardVote); z++) {
											let emptyStar = document.createElement('i');
											emptyStar.classList.add('fas', 'fa-star', 'empty')
											stars.appendChild(emptyStar);
										}
									}
							let revCount = document.createElement('span');
							revCount.innerHTML = '(' + currentArray[i]['rev_count'] + ')';
							cardVoteCnt.appendChild(revCount);
							cardContent.appendChild(cardVoteCnt);

							// Description
							let descriptionCnt = document.createElement('div');
							descriptionCnt.classList.add('provided-description');

								//Card bio
								let cardBio = document.createElement('p');
								let textCardBio = document.createTextNode(currentArray[i]['bio_text4'].substring(0, 90));
								cardBio.appendChild(textCardBio);
								if (currentArray[i]['bio_text4'].length > 80) {
									let dots = document.createElement('span');
									dots.innerHTML = '...';
									cardBio.appendChild(dots);
								}
								descriptionCnt.appendChild(cardBio);
							cardContent.appendChild(descriptionCnt);

							// Genres
							let genresCnt = document.createElement('div');
							genresCnt.classList.add('provided-genres');
							let genresTitle = document.createElement('h6');
							genresTitle.innerHTML = 'Genres';
							genresCnt.appendChild(genresTitle);

							if(currentArray[i].hasOwnProperty('genres')) {
								let genresLength = currentArray[i]['genres'].length;
								for (let z = 0; z < genresLength; z++) {
									if(z > 4) break;
									let genresText = document.createElement('span');
									if(z < (genresLength - 1) && (z < 4)) {
										genresText.innerHTML = currentArray[i]['genres'][z].toUpperCase() + ' /&nbsp';
									}
									else {
										genresText.innerHTML = currentArray[i]['genres'][z].toUpperCase();
									}
									genresCnt.appendChild(genresText);
								}
							}
							cardContent.appendChild(genresCnt);



			}
		},
		// INTERNAL APIs
		filterCall() {
			if (this.category_selected !== null) {
				this.category_selected = this.category_selected.toLowerCase();
			}
			if (this.genre_selected !== null) {
				this.genre_selected = this.genre_selected.toLowerCase();
			}
			axios.get(this.iper_profiles_url, {
				params: {
					category	: this.category_selected,
					genre		: this.genre_selected,
					vote		: this.vote_selected,
					reviewNum	: this.reviewNum_selected,
					only_sponsorship: this.onlySponsorship,
					profile_num_start : this.start,
					profile_num_end : this.end
				}
			})
			.then((resp) => {
				this.load_visible = false;
				this.iper_profiles = resp.data.results;
				this.is_last_profile_group = resp.data.is_last_profile_group;
				this.displayProfiles.push(this.iper_profiles);
				if(this.displayProfiles[0].length > 0) {
					this.showCards = true;
				}
				else {
					this.resultsNotFound = true;
					this.showCards = false;
				}
				if(this.more) {
					this.buildHTML();
				}

			})
			.catch((error) => {
				console.error(error);
			});
		},
		
		searchDefault() {
			if(typeof(search_from_home_key) !== 'undefined'){
				if(search_from_home_key === 'category') {
					this.btnCategories = search_from_home_value;
					this.category_selected = search_from_home_value;
					this.btnGeneres = 'No filter';
					this.btnVotes = 'No filter';
				}
				else if (search_from_home_key === 'genre') {
					this.btnGeneres = search_from_home_value;
					this.genre_selected = search_from_home_value;
					this.btnCategories = 'No filter';
					this.btnVotes = 'No filter';
				}
				else {
					this.btnCategories = 'No filter';
					this.btnGeneres = 'No filter';
					this.btnVotes = 'No filter';
				}
			}
			else {
				this.btnCategories = 'No filter';
				this.btnGeneres = 'No filter';
				this.btnVotes = 'No filter';
			}
			this.filterCall();
		},

		addEventClickListener() {
			document.addEventListener('click', () => {
				this.showCategoryPannel = false;
				this.showGenrePannel = false;
				this.showVotePannel = false;
				this.searchHome = false;
			});
			return;
		},
		addEventClickListenerAuth() {
			document.addEventListener('click', () => {
				this.showAuthPannel = false;
			});
		}
	},
	mounted() {
    window.addEventListener('scroll', this.updateScroll); //scroll
		this.resultsNotFound = false;
		this.addEventClickListenerAuth();
		var ulr_path = window.location.pathname;
		if (ulr_path == '/') {
			this.onlySponsorship = true,
			this.showCards = false,
			this.searchDefault();
			this.addEventClickListener();
			this.base_url = 'profiles/search/';
			this.wantToWork();
			this.descriptionItem();
		}	
		if (ulr_path == '/profiles/search') {
			this.onlySponsorship = false,
			this.showCards = false,
			this.searchDefault();
			this.addEventClickListener();
			this.base_url = 'search/';
		}
	},
	created() {			
	},
	updated() {
	}
});


// scroll su link con ancora nella pagina

$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 700, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});


////////////////////////////////////////////////////////
// COSE DA FARE
/**
 * [2]
 * ! chiudere tendine quando clicco altrove
 */

////////////////////////////////////////////////////////
// COSE FATTIBILI
/**
 * [1] 
 * lisa valori DB di: categories, genres, (eventuelmente) offers
 */
////////////////////////////////////////////////////////

