export const strict = false

//Nuxtの拡張によりこのような記述になる
export const state = () => { //コンポーネントにおけるdataのような立ち振る舞い
    return {
        user: null
    }
}

export const getters = {
    //ログインしているかしてないかの判定
    isAuthenticated (state) {
        //userがnull => !null は true !!null は false
        //user{} => !{} は false !!{} は true
        return !!state.user
    }
}

export const mutations = { //stateをactionsから受け取って実際に変更するmutations
    //userの情報を書き換える
    setUser (state, user) {
        state.user = user
    }
}

export const actions = {
    // statを変更する情報を取得して、mutationsへ渡す
    setUser(context, user) {
        // 今からmutationsへ渡すという宣言
        context.commit('setUser', user)
    }
}