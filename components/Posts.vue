<template>
  <div>
   <div class="posts overflow-scroll mb-24">
     <post v-for="(post, index) in posts" :key="index" :post="post" />
   </div>
   <!-- ログインしていれば投稿モーダルを表示する -->
   <div v-if="isAuthenticated && modalVisible" class="modal">
     <div class="actions mt-4 flex justify-between px-8">
       <div class="back-btn vertical-middle" @click="modalVisible = false">
         <img src="/images/back.svg" alt="" class="h-4">
       </div>
       <div class="post-btn" @click="post">
         POST
       </div>
     </div>
     <div class="modal_content p-8">
       <div class="flex justify-center p-8">
         <img :src="imageUrl" alt="" class="upload-image"><!-- イメージのURLをバインディング -->
       </div>
      <el-upload
        v-if="!imageUrl"
        action=""
        :show-file-list="false"
        :http-request="uploadFile"
      >
        <el-button size="samll" type="info">Click to upload</el-button>
      </el-upload>
      <el-input
       type="textarea"
       :rows="8"
       placeholder="Please input"
       class="mt-8"
       v-model="text"
      >
      </el-input>
     </div>
   </div>
   <!-- ログインしていなければロイグンモーダルを表示する -->
   <div  v-else-if="!isAuthenticated && modalVisible" class="modal">
     <div class="actions mt-4 flex justify-between px-8">
       <div class="back-btn vertical-middle" @click="modalVisible = false">
         <img src="/images/back.svg" alt="" class="h-4">
       </div>
       <div class="modal_content p-8 w-full h-full relative">
         <div class="flex justify-center">
           <img src="/images/logo.png" alt="" class="w-32 my-32">
         </div>
         <el-button size="small" type="info" @click="login">Login</el-button>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
import Post from '~/components/Post.vue'
import { db, firebase } from '~/plugins/firebase' //firestore,storageを使用する
import { mapActions } from 'vuex'

export default {
  components: {
    Post
  },
  data () {
    return {
      posts: [],
      imageUrl: null,
      text: null,
      modalVisible: false,
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user //グローバルのstoreのデーターにアクセスできる
    },
    isAuthenticated () {
      return this.$store.getters.isAuthenticated //グローバルのgettersにアクセス
    }
  },
  methods: {
    ...mapActions(['setUser']),
    login () {
      const provider = new firebase.auth.GoogleAuthProvider() //GoogleAuthプロバイダの情報を初期化
      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          this.setUser(result.user)
        }).catch((error) => {
          window.alert(error)
        })
    },
    async post () {
      await db.collection('posts').add({ //投稿を追加、保存する処理
        text: this.text,
        image: this.imageUrl,
        createdAt: new Date().getTime()
      })
      this.modalVisible = false //投稿モーダルを非表示にする
      this.text = null //初期化
      this.imageUrl = null //初期化
      window.alert('保存しました！')
    },
    openModal () {
      this.modalVisible = true
    },
    async uploadFile (data) {
      const storageRef = firebase.storage().ref()
      const time = new Date().getTime() //写真ファイルに一意の名前をつける
      const ref = storageRef.child(`posts/${time}_${data.file.name}`) //
      const snapshot = await ref.put(data.file) //画像データーをFireBasestoregeへアップする,非同期処理
      const url = await snapshot.ref.getDownloadURL() //画像をダウンロードする,非同期処理
      this.imageUrl = url
    }
  },
  mounted () {
    db.collection('posts').orderBy('createdAt').onSnapshot((snaphsot) => {
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