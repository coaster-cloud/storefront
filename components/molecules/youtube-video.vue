<template>
  <div class="mt-3">
    <div v-if="play === false" class="youtube-player">
      <img class="img-fluid" src="~/assets/images/video.placeholder.middle.jpg">
      <div class="youtube-player__consent">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="youtube-player__text" v-html="$t('play_video_consent')" />
        <p class="youtube-player__text">
          <b-button pill variant="danger" @click="play = true">
            <b-icon icon="play-fill" aria-hidden="true" />
            {{ $t('play_video') }}
          </b-button>
        </p>
      </div>
    </div>

    <div v-if="play === true" class="youtube-iframe">
      <iframe :src="`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;" allowfullscreen />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videoId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      play: false
    }
  }
}
</script>

<style lang="scss">
@import "~/assets/css/ci";

.youtube-player {
  position: relative;
}

.youtube-player__consent {
  top: 50%;
  left: 0;
  position: absolute;
  width: 100%;
  text-align: center;
  transform: translateY(-50%);
  background: hsla(0,0%,0%,.8);
  color: #fff;
  padding: 1em;
}

.youtube-player__text {
  margin-bottom: 1em;

  a {
    color: #28a745;

    &:hover {
      color: #30c553;
    }
  }
}

.youtube-iframe {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 0;
  height: 0;
  overflow: hidden;

  & iframe, object, embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
