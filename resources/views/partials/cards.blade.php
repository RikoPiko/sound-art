{{-- CARDS --}}
<section class="card-list">
    <div class="container">
      <div class="row">
        <div v-for="(card, index) in iper_profiles" :key="card.id" class="col-lg-3 col-md-4 col-sm-6">
          <div class="card-cnt">

            {{-- CARD IMAGE --}}
            <div class="card-image">
              <img :src="'../storage/' + card.image_url" alt="Artist image">
            </div>

            {{-- BODY DELLA CARTA --}}
            <div class="card-content">

              {{-- Categories --}}
              <div class="provided-card-title">
                <a class="provided-categories" v-bind:href="'search/' + card.slug">
                  <h3>
                    <span  v-for="category, index in card.categories" :key="category.id" v-if="index < 3">@{{category}}
                      <span v-if="index < (card.categories.length - 1)">/</span>
                    </span>          
                  </h3>
                </a>

                {{--Name, Surname, Work town--}}
                <a class="provided-name" v-bind:href="'search/' + card.slug">
                  <span>@{{card.name}} @{{card.surname}}</span>
                </a>
                <span>, @{{card.work_town}}</span>
              </div>

              {{-- Vote --}}
              <div class="vote">
                  <i v-for="filled in Math.round(card.average_vote)" :key="filled.id" class="fas fa-star filled"></i>
                  <i v-if="Math.round(card.average_vote) < 5" v-for="empty in (5 - Math.round(card.average_vote))" :key="empty.id" class="fas fa-star empty"></i>
                  <span>(@{{card.rev_count}})</span>     
              </div>

              {{-- DESCRIZIONE --}}
              <div class="provided-description">
                <p>
                  @{{card.bio_text4.substring(0, 90)}}
                  <span v-if="card.bio_text4.length > 80">...</span>
                </p>
              </div>

              {{-- Genres --}}
              <div class="provided-genres">
                <h6>Genres</h6>
                <span v-for="genre, index in card.genres" :key="genre.id" v-if="index < 5">
                    @{{genre}}
                    <span v-if="index < card.genres.length - 1">/</span>
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>