/* export const strict = false;

export const state = () => ({
    address: {
        type: String,
        default : ""
    }
});

export const getters = {
    loggedInUser(state : any) {
        try {
            var tempData = localStorage.getItem("data")
            if(tempData)
            {
                var temp = JSON.parse(tempData)
                state.address = temp.address
            }
            console.log(state.address)
            return state.address
        } catch {
            state.address = null
        }
    },
};

export const mutations = {};

export const actions = {};
*/
