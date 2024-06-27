
export default function formattedString(string,count){
    if(string.length < count){
        return string
    }
    return string.substr(0,count)+"..."
}