<template>
 <div>
   <div class="posts overflow-scroll mb-24">
     <post v-for="(post, index) in posts" :post="post.content" :key="index" :user="post.user" :be-liked="post.beLiked" />
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
      posts: [
        {
          user: {
          displayName: 'nari369',
          photoURL: '/images/post0.jpg',
          },
          content: {
            text: 'NOW toyama',
            image: 'images/post1.jpg'
          },
          beLiked: true
        },
        {
          user: {
          displayName: 'sae369',
          photoURL: '/images/post1.jpg',
          },
          content: {
            text: 'NOW namerikawa',
            image: 'images/post0.jpg'
          },
          beLiked: false
        },
      ]
    }
  },
}
</script>