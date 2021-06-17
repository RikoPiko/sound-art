<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 
// %         GUEST ROUTES        % 
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 

/**
 * # HOME = SIMPLE SEARCH #
 * 
 * home page con ricerca semplice
 * http://localhost:8000/
 */
Route::get('/', 'HomeController@index')->name('home');

/**
 * # PROFILES = ADVANCED SEARCH #
 * 
 * Profile CRUD: parte guest (index,show) TUTTI I PROFILI
 * http://localhost:8000/search
 */
Route::prefix('search')   	// prefisso URI raggruppamento sezione /search/...
	->group(function () {	// rotte specifiche search = profiles

		// atterraggio diretto senza filtri 
		Route::get('/', 'ProfileController@search')->name('search'); // ! ->name('profiles.index') || return view('guest.profiles.search');

		// atterraggio da home page form ricerca semplice 
		Route::post('/', 'ProfileController@search_from_home')->name('search_from_home');  // ! return view('guest.profiles.search');

		// dettaglio profilo (di chiunque per chiunque)
		Route::get('/{slug}', 'ProfileController@show')->name('profiles.show'); // ! return view('guest.profiles.show');

	});

/**
 * # MESSAGES #
 * 
 * Message CRUD: parte guest (create,store)
 * http://localhost:8000/messages
 */
Route::prefix('messages')   // prefisso URI raggruppamento sezione /messages/...
	->group(function () {	// rotte specifiche messages

		Route::get('/create',	'MessageController@create')->name('messages.create'); // ! return view('guest.messages.create');
		Route::post('/',		'MessageController@store')->name('messages.store');  // ! return redirect()->route('NON LO SO')->with('status','Message sent');
		
	});

/**
 * # REVIEWS #
 * 
 * Review CRUD: parte guest (create,store)
 * http://localhost:8000/reviews
 */
Route::prefix('reviews')   // prefisso URI raggruppamento sezione /reviews/...
	->group(function () {	// rotte specifiche reviews

		Route::get('/create',	'ReviewController@create')->name('reviews.create'); // ! return view('guest.reviews.create');
		Route::post('/', 		'ReviewController@store')->name('reviews.store');  // ! return redirect()->route('NON LO SO')->with('status','Review sent');
		
	});


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 
// %         ADMIN ROUTES        % 
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 

Auth::routes(); // signup presente in guest home
// Auth::routes(['register'=>false]); // disattivazione signup in guest home 

Route::prefix('admin')   	// prefisso URI raggruppamento sezione /admin/...
	->namespace('Admin')	// ubicazione dei Controller admin /app/Http/Controllers/Admin/...
	->middleware('auth')	// controllore autenticazione
	->group(function () {	// rotte specifiche admin

		/**
		 * # DASHBOARD #
		 * 
		 * home dell'utente loggato >>> definita in laravel qua:
		 * 
		 * /app/Http/Providers/RouteServiceProvider
		 *		public const HOME = '/admin/dashboard';
		 *
		 * http://localhost:8000/admin/dashboard
		 */
		Route::get('/dashboard', 'HomeController@index')->name('dashboard'); // ! return view('admin.dashboard');

		/**
		 * # PROFILES #
		 * 
		 * Profile CRUD: parte admin (create,store,edit,update,destroy) SOLO IL PROPRIO PROFILE
		 * http://localhost:8000/admin/profiles
		 */
		Route::resource('/profiles', ProfileController::class)->names([
			'index'		=> 'admin.profiles.index',		// ! GET'/profiles'				return view('admin.profiles.index'); >>>>>>> È DIVERSA DALLA DASHBOARD !!!
			'show'		=> 'admin.profiles.show',		// ! GET'/profiles/{slug}'		return view('admin.profiles.show');
			'create' 	=> 'admin.profiles.create',		// ! GET'/profiles/create'		return view('admin.profiles.create');
			'store' 	=> 'admin.profiles.store',		// ! POST'/profiles'			return redirect()->route('dashboard')->with('status','Profile created');
			'edit' 		=> 'admin.profiles.edit',		// ! GET'/profiles/{slug}/edit'	return view('admin.profiles.edit');
			'update' 	=> 'admin.profiles.update',		// ! PUT'/profiles/{slug}'		return redirect()->route('dashboard')->with('status','Profile udated');
			'destroy' 	=> 'admin.profiles.destroy',	// ! DEL'/profiles/{slug}'		return redirect()->route('dashboard')->with('status','Profile deleted');
		]);

		/**
		 * # MESSAGES #
		 * 
		 * Message CRUD: parte admin (index,show,destroy) SOLO I PROPRI MESSAGGI RICEVUTI
		 * http://localhost:8000/admin/messages
		 */
		Route::resource('/messages', MessageController::class)->names([
			'index'		=> 'admin.messages.index',		// ! GET'/messages'				return view('admin.messages.index');
			'show'		=> 'admin.messages.show',		// ! GET'/messages/{slug}'		return view('admin.messages.show');
			'destroy' 	=> 'admin.messages.destroy',	// ! DEL'/messages/{slug}'		return redirect()->route('dashboard')->with('status','Message deleted');
		]);

		/**
		 * # REVIEWS #
		 * 
		 * Review CRUD: parte admin (index,show) SOLO LE PROPRIE RECENSIONI RICEVUTE 
		 * http://localhost:8000/admin/reviews
		 */
		// Route::get('/reviews',			'ReviewController@index')->name('admin.reviews.index'); // ! return view('admin.reviews.index');
		// Route::get('/reviews/{slug}',	'ReviewController@show')->name('admin.reviews.show'); 	// ! return view('admin.reviews.show');

		 Route::resource('/reviews', ReviewController::class)->names([
			'index' 	=> 'admin.reviews.index', 	// ! return view('admin.reviews.index');
			'show' 		=> 'admin.reviews.show',	// ! return view('admin.reviews.show');
		]);


		// ! POI LE ROTTE PER IL RAMO SPONSORSHIP
		//


		
		/**
		 * API con token
		 * pannello generazione token utente loggato
		 * generazione token 
		 */
		// Route::get('/profile', 'HomeController@profile')->name('admin-profile');
		// Route::post('/profile/generate-token', 'HomeController@generateToken')->name('admin.generate_token');




	});




// ############################### 
// #         DEV  ROUTES         # 
// ############################### 

Route::get('/test', 'HomeController@test')->name('test');  // ! SOLO PER TESTARE CODICE 


