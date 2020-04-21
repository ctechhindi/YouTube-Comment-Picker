<template>
  <div class="home">
    <canvas id="canvas"></canvas>
    <div class="oncanvas has-text-centered">
      <div class="container">
        <img src="@/assets/img/logo-377x-134.png" class="animated heartBeat" alt="Logo" />
        <h1 class="title has-text-white animated bounce">YouTube Random Comment Picker</h1>
        <h2
          class="subtitle has-text-white animated fadeInDown"
        >Use it to choose from giveaway winner YouTube video comments.</h2>
        <br />
        <div class="content urlinput animated fadeInLeft">
          <div class="control has-icons-left">
            <input
              class="input is-large"
              type="search"
              v-on:keyup.enter="init"
              v-model="url"
              placeholder="Paste YouTube Video URL"
            />
            <span class="icon is-medium is-left">
              <i class="mdi mdi-youtube" aria-hidden="true"></i>
            </span>
          </div>
        </div>
        <section id="section-one" class="section">
          <div class="container has-text-centered has-text-white">
            <div class="columns is-mobile">
              <div class="column is-4 animated fadeInUp">
                <p class="title is-4 has-text-white">
                  <strong class="has-text-black">100% Responsive</strong>
                </p>
                <p class="subtitle is-6 has-text-white">
                  Designed for
                  <strong class="has-text-white">laptop</strong> first
                </p>
                <b-icon size="is-large" icon="monitor" type="is-white"></b-icon>
              </div>
              <div class="column is-4 animated fadeInUp">
                <p class="title is-4 has-text-white">
                  <strong class="has-text-black">Modern</strong>
                </p>
                <p class="subtitle is-6 has-text-white">
                  Built with
                  <strong class="has-text-white">Vue CLI 4</strong>
                </p>
                <b-icon size="is-large" icon="vuejs" type="is-white"></b-icon>
              </div>
              <div class="column is-4 animated fadeInUp">
                <p class="title is-4 has-text-white">
                  <strong class="has-text-black">Free</strong>
                </p>
                <p class="subtitle is-6 has-text-white">
                  Open source on
                  <strong class="has-text-white">GitHub</strong>
                </p>
                <b-icon size="is-large" icon="github" type="is-white"></b-icon>
              </div>
            </div>
          </div>
        </section>
        <p class="copyright has-text-white animated flash">
          Copyrights ©
          <a
            target="_blank"
            style="color: cyan;"
            href="http://ctechhindi.in/"
          >C Tech Hindi</a> 2020 | Made with
          <i class="mdi mdi-heart mdi-24px" style="color: red;"></i>
          &nbsp;in India
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Canvas from "../assets/js/animation.min";

export default {
  name: "Home",
  metaInfo: {
    title: "Home Page",
    titleTemplate: "%s - YouTube Comment Picker V3",
    htmlAttrs: {
      lang: "en",
      amp: true
    }
  },
  data() {
    return {
      url: ""
    };
  },
  methods: {
    init() {
      // Event tracking in Google Analytics
      this.$ga.event("Home", "Video URL", this.url);

      // Fetch YouTube Video ID
      var videoId = this.fetchVideoID(this.url);
      if (videoId !== false) {
        this.$router.push({ name: "Picker", params: { 'id': videoId } });
      } else {
        // Error
        this.$buefy.snackbar.open({
          message:
            "We are not able to check the video url you have provided. Please check the url of Video.",
          type: "is-warning",
          position: "is-bottom"
        });

        // Error Animation
        const element = document.querySelector(".urlinput");
        element.classList.remove("animated", "fadeInLeft");
        element.classList.add("animated", "shake");
        setTimeout(() => {
          element.classList.remove("animated", "shake");
        }, 100);
      }
    },

    /**
     * Fetch YouTube Video ID form Video URL
     * @param {string} url
     */
    fetchVideoID: function(url) {
      /**
        These are the types of URLs supported
        http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
        http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
        http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
        http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
        http://www.youtube.com/embed/0zM3nApSvMg?rel=0
        http://www.youtube.com/watch?v=0zM3nApSvMg
        http://youtu.be/0zM3nApSvMg
      **/
      var youtubeRegExp = /(?:[?&]vi?=|\/embed\/|\/\d\d?\/|\/vi?\/|https?:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/;
      var match = url.match(youtubeRegExp);

      if (match && match[1].length == 11) {
        if (match[1] !== undefined && match[1] !== null && match[1] !== "") {
          return match[1];
        }
      }
      return false;
    }
  },
  mounted() {
    new Canvas({
      el: document.getElementById("canvas"),
      count: 25,
      speed: 0.3,
      radius: 10,
      width: function() {
        return window.innerWidth;
      },
      height: function() {
        return window.innerHeight + 80;
      },
      size: 15,
      color: "251, 0, 83",
      maxDistance: 100,
      background: ["216, 81, 82", "154, 27, 69"]
    });

    this.$Progress.finish()
  }
};
</script>

<style>
.oncanvas {
  position: absolute;
  top: 65px;
  width: 100%;
  height: auto;
  padding: 30px 8px 0px;
}

.oncanvas .title {
  letter-spacing: 0.1em;
  font-size: 20px;
}

.oncanvas .subtitle {
  letter-spacing: 0.1em;
  font-size: 15px;
}

.oncanvas .urlinput {
  max-width: 950px;
  margin: 0px auto;
}

@media only screen and (max-width: 768px) {
}

@media only screen and (max-width: 670px) {
  .oncanvas .title {
    font-size: 15px;
  }

  .oncanvas .subtitle {
    font-size: 15px;
  }

  #section-one .title {
    font-size: 15px;
  }

  #section-one .subtitle {
    font-size: 15px;
  }
}
</style>