<template>
 <div>
   <div class="posts overflow-scroll mb-24">
     <post :post="post" :user="user" :be-liked="beLiked" />
     <post :post="post" :user="user" />
   </div>
 </div>
</template>

<script>
import Post from '~/components/Post.vue'

export default {
  components: {
    Post
  },
  data () {
    return {
      user: {
        displayName: 'nari369',
        photoURL: '/images/post0.jpg',
      },
      post: {
        text: 'NOW TOYAMA',
        image: 'images/post1.jpg'
      },
      beLiked: true
    }
  }
}
</script>