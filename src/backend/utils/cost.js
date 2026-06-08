export const getSommeCost = (costs) => {
    return costs.reduce((acc, cost) => {
        return acc + ((cost.duration * cost.cost_time / 3600) + cost.cost_fixed);
    }, 0);
};

export const getSommeTimeCost = (costs) => {
    return costs.reduce((acc, cost) => {
        return acc + cost.cost_time;
    }, 0);
};

export const getSommeFixedCost = (costs) => {
    return costs.reduce((acc, cost) => {
        return acc + cost.cost_fixed;
    }, 0);
};

export const getSommeDuration = (costs) => {    
    return costs.reduce((acc, cost) => {
        return acc + cost.duration;
    }
    , 0);
};