import {PersistentStore, Store} from "./base";
import {USER_STORE_NAME} from "./store-names";

interface User extends Object {
    loggedIn: boolean,
    id?: number,
    name: string,
    avatar: string
}

const ANONYMOUS_USER = {
    id: null,
    loggedIn: false,
    name: 'Anonymous',
    avatar: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80'
};

class UserStore extends PersistentStore<User> {
    protected data(): User {
        return {...ANONYMOUS_USER};
    }

    setUser(data) {
        console.log('setting data in setUser():', data)
        this.state.loggedIn = true;
        this.state.id = data.id;
        this.state.name = data.name;
        this.state.avatar = data.avatar;
    }

    setLoggedOut() {
        this.state = Object.assign(this.state, {...ANONYMOUS_USER})
    }
}

export const userStore = new UserStore(USER_STORE_NAME);