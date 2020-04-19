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
            <input class="input is-large" type="search" placeholder="Paste YouTube Video URL" />
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
                  <strong class="has-text-white">Vue CLI 3</strong>
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