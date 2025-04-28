/* Array functions that should just be in javascript (I hate js)*/

//Copy the contents of array1 to array2 without any assignment.
function copyTo(source, target) {
    source.forEach(element => {
        target.push(element);        
    });
}

export {copyTo};