const ElementForm = ({ element }) => (
    <div>{ element.text }:
    <input type='text' value={ element.value } onChange={ element.onElementChange } />
    </div>
)

export default ElementForm