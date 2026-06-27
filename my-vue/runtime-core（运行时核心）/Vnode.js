// 创建虚拟节点
export function h (tag, props, children = null) {
  return {
    tag,
    props,
    children
  }
}

export function render (vnode, container) {
  const {tag, props, children} = vnode // 解构赋值
  const el = document.createElement(tag)
  if (props) {
    // 处理属性
    el.setAttribute('class', props.class)
  }
  if (children) {
    // 处理子节点
    handleChildren(children, el)
  }
  // 将元素挂载到容器中
  container.appendChild(el)
}
/**
 * 1. 字符串：创建文本节点 document.createTextNode(children)                                                             
 * 2. VNode 对象：递归调用 render                                                                                        
 * 3. 数组：遍历处理每一项
 */
function handleChildren (children, element) {
  //  1. 字符串：创建文本节点 document.createTextNode(children)  
  if (typeof children === "string") {
    const textNode = document.createTextNode(children)
    element.appendChild(textNode)
  } else if (Array.isArray(children)) {
    // 3. 数组：遍历处理每一项
    // 递归调用 handleChildren 处理每个子项
       children.forEach(child => {
        handleChildren(child, element)
      })
  } else {
    // 2. VNode 对象：递归调用 render                                                                                        
    render(children, element)
  }
} 