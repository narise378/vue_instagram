<template>
 <div>
   <div class="posts overflow-scroll mb-24">
     <post v-for="(post, index) in posts" :key="index" :post="post" />
   </div>
 </div>
</template>

<script>
import Post from '~/components/Post.vue'
import { db } from '~/plugins/firebase' //firestoreを使用する

export default {
  components: {
    Post
  },
  data () {
    return {
      posts: []
    }
  },
  mounted () {
    db.collection('posts').onSnapshot((snaphsot) => {
      snaphsot.docChanges().forEach((change) => {
        const doc = change.doc //ドキュメントの変更内容を取得
        if(change.type === 'added') { //追加、変更があった場合更新する
          this.posts.unshift({ id: doc.id, ...doc.data() }) //unshiftはdesみたいな感じ
        }
      })
    })
  }
  // async mounted () { //postが描画されるタイミングでデーターベースから値をとる
  //   const snapshot = await db.collection('posts').get()
  //   // .then((snapshot) => {
  //   //   console.log('thenの中')})async,awaitによりthenの記述部分が見通しがよくなる
  //   snapshot.forEach((doc) => { //firestoreのドキュメントからforEachで取得する
  //     this.posts.push({ id:doc.id, ...doc.data() }) //dataのpostsに投げる
  //   })
  // }
}
</script>