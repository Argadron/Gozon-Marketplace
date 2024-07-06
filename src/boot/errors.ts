export default function (e:any) {
    if(e.response?.data?.message){
        console.log(e)
        switch(e.response?.data?.message){

            case "Unauthorized":
                window.location.href ="/login"
                alert("Войдите в систему")
                return null;
                
            default:
                console.error(e)
                alert("Короче, произошла непредвиденная ошибка без обработчиков. Либо вы что-то нашаманили, либо фронт просто облажался. Можете ему позвонить, и рассказать какой он слоупок. Все подробности в консоли")
        }
    }
}