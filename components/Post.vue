<template>
    <div class="posts overflow-scroll mb-24">
        <div class="post my-6">
        <div class="user mb-2 ml-4 flex">
            <div class="avatar mr-3">
            <a><img :src="user.photoURL" class="w-8 h-8 rounded-full" alt=""></a>
            </div>
            <div class="user-name leading-loose text-sm">
            <p class="font-bold">{{ username }}</p>
            </div>
        </div>
        <div class="post-image w-full">
            <img :src="post.image" alt="">
        </div>
        <div class="actions my-2 ml-4 flex">
            <img v-if="beLiked" src='/images/heart_active.svg' @click="unlike" class="w-6 mr-3">
            <img v-else src='/images/heart.svg' @click="like" class="w-6 mr-3">
            <p>{{ likeCount }}</p>
        </div>
        <div class="message mx-4 text-sm">
            <p>{{ post.text }}</p>
        </div>
        </div>
    </div>
</template>

<script>
import { db } from '~/plugins/firebase'

export default {
    props: ['post'],
    data () {
        return {
            user: {
                displayName: 'nari369',
                photoURL: '/images/post0.jpg'
            },
            likeCount: 0,
            beLiked: false
        }
    },
    mounted () {
        // dbのposts配下に新しいコレクションlikesを作成し、いいねの情報を保存する
        this.likeRef = db.collection('posts').doc(this.post.id).collection('likes')
        this.checkLikeStatus()

        // onSnapshotでコレクションで起こった変化を監視する
        this.likeRef.onSnapshot((snap) => {
            this.likeCount = snap.size // snap.sizeでそこに何件保存されているかを確認できる
        })
    },
    methods: {
        async like () {
            // ログインしているユーザーの一意のidをイイネの情報としてsetする
            await this.likeRef.doc(this.currentUser.uid).set({ uid: this.currentUser.uid })
            this.beLiked = true
        },
        async unlike () {
            // イイネを外す、deleteメソッドを使うだけ
            await this.likeRef.doc(this.currentUser.uid).delete()
            this.beLiked = false
        },
        async checkLikeStatus () {
            // いいねしているかどうかのチェック、getとexistsを使用して判定する
            const doc = await this.likeRef.doc(this.currentUser.uid).get()
            this.beLiked = doc.exists // existsはdocが存在しているかどうかを判定する
        }
    },
    computed: {
        currentUser () {
            return this.$store.state.user
        },
        username () {
            return this.user.displayName.charAt(0).toUpperCase() + this.user.displayName.slice(1)
        }
    },
}
</script>