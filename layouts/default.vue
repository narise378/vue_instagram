<template>
  <div>
    <nuxt />
    <app-footer />
  </div>
</template>

<script>
import AppFooter from '~/components/Footer'
import { firebase } from '~/plugins/firebase'
import { mapActions } from 'vuex'

export default {
  components: {
    AppFooter
  },
  methods: {
    ...mapActions(['setUser'])
  },
  mounted () {
    //認証情報が変化した時
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.setUser(user)
      }
    })
  },
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.vertical-middle {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal {
 background: white;
 width: 100%;
 height: 100%;
 position: fixed;
 top: 0;
}

.uploaded-image {
 max-height: 120px;
}

.post-btn {
 padding: 4px 12px;
 border-radius: 24px;
 color: black;
 font-size: 12px;
 cursor: pointer;
}

.el-upload {
 width: 100%;
}

.el-button {
 width: 100%;
}
</style>
