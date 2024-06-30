
export function formattedString(string,count){
        return string.substr(0,count)
}

export function formattedPrice(price){
    let res = "";
    let reversedPrice = price.toString().split("").reverse().join("")
    console.log(reversedPrice)
    reversedPrice.split("").forEach((val,index)=>{
        if(index%3==0&&index!==0){
            res+='.'
        }
        res+=val
    })

    res = res.split('').reverse().join('')
    console.log(res)
    return res;
}

