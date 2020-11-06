export class CreateField{
  constructor(parent, className){
    this.container = document.createElement('d')
    this.container.className = className
    parent.appendChild(this.container)

    this.id = ''
    this.input = undefined
    this.dependants = []
  }
  getId(){
    return this.id
  }
  appendDependants(dependant){
    this.dependants.push(dependant)
  }
  activateDependants(){
    this.dependants.forEach((dep)=>{
      dep.style.filter = 'none';
      dep.style.opacity = 1;
      dep.style.cursor = 'pointer'
    })
  }
  disableDependants(){
    this.dependants.forEach((dep)=>{
      dep.style.filter = "blur(5px)";
      dep.style.opacity = 0.5;
      dep.style.cursor = 'auto'
    })
  }
  onevents(event){
    if( this.input.value.length > 12 ){
      this.id = this.input.value.substring(0,12)
    }else{
      this.id = this.input.value
    }
    if( this.input.value.length >= 3 ){
      this.activateDependants()
    }else{
      this.disableDependants()
    }
  }
  spawn(){
    this.input = document.createElement('input')
    this.input.type = 'text'
    this.input.maxLength = 12
    this.input.placeholder = 'type id here'
    this.input.oninput = (e)=>{this.onevents(e)}
    this.container.appendChild(this.input)
  }
}


/*
const CreateField = (parent, className) => {
  const OnChange = (event) => {
    console.log(event)
  }
  const input = document.createElement('input')
  input.type = 'text'
  input.maxLength = 13
  input.placeholder = 'type id here'
  input.onkeydown = (event)=>{OnChange(event)}
  d.appendChild(input)
  parent.appendChild(d)
}
*/