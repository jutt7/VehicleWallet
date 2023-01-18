import { MultiCascader, Icon } from 'rsuite';
import { Trans } from "../../../i18n";


function createNode() {
    return {
        label: `Node${(Math.random() * 1e18)
            .toString(36)
            .slice(0, 3)
            .toUpperCase()}`,
        value: Math.random() * 1e18,
        children: Math.random() > 0.5 ? [] : null
    };
}

function createChildren() {
    const children = [];
    for (let i = 0; i < Math.random() * 10; i++) {
        children.push(createNode());
    }
    return children;
}

function getChildrenByNode(node, callback) {
    setTimeout(() => {
        callback(createChildren());
    }, 1000);
}

class AsynExampleMultiCascade extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSelect(node, activePaths, concat, event) {
        if (node.children && !node.children.length) {
            /* getChildrenByNode(node, children => {
                this.setState({ data: concat(this.state.data, children) });
            }); */
        }
    }

    handleChange(value, event) {
        this.setState({ value });
    }

    renderMenu(children, menu, parentNode) {
        if (children.length === 0) {
            return (
                <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
                    <Icon icon="spinner" spin /> Loading...
                </p>
            );
        }
        return menu;
    }

    componentDidMount() {
        let route = {}
        let area = []
        let temp = []
        if (this.props.routes && this.props.routes.length > 0) {

            for (let i = 0; i < this.props.routes.length; i++) {
                if (this.props.routes[i].route_name != null && this.props.routes[i].route_name[this.props.lang]) {
                    route = {
                        "name": this.props.routes[i].route_name && this.props.routes[i].route_name[this.props.lang] ?
                            `${this.props.routes[i].route_name[this.props.lang]}-${this.props.routes[i].route_id}` :
                            `${this.props.routes[i].route_name}-${this.props.routes[i].route_id}`,
                        "id": "route-" + this.props.routes[i].route_id
                    }
                    //console.log("ASYNC mount", this.props.routes[i].route_name)

                    if (this.props.routes[i].locations) {
                        for (let j = 0; j < this.props.routes[i].locations.length; j++) {
                            this.props.routes[i].locations[j] = JSON.parse(this.props.routes[i].locations[j])
                            if (this.props.routes[i].locations[j].location_name != null && this.props.routes[i].locations[j].location_name)
                                area.push({
                                    "label": this.props.routes[i].locations[j].location_name[this.props.lang],
                                    "value": this.props.routes[i].locations[j].location_id,
                                    "children": null
                                })
                        }
                    }

                }

                temp.push({
                    label: route.name,
                    value: route.id,
                    children: area
                })

                area = []
                route = {}
            }

            this.setState({
                data: temp
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let route = {}
        let area = []
        let temp = []
        if (prevProps.routes != this.props.routes) {
            for (let i = 0; i < this.props.routes.length; i++) {
                if (this.props.routes[i].route_name != null && this.props.routes[i].route_name[this.props.lang]) {
                    route = {
                        "name": this.props.routes[i].route_name && this.props.routes[i].route_name[this.props.lang] ?
                            `${this.props.routes[i].route_name[this.props.lang]}-${this.props.routes[i].route_id}` :
                            `${this.props.routes[i].route_name}-${this.props.routes[i].route_id}`,
                        "id": "route-" + this.props.routes[i].route_id
                    }
                    //console.log("ASYNC update", this.props.routes[i].route_name)
                    if (this.props.routes[i].locations) {
                        for (let j = 0; j < this.props.routes[i].locations.length; j++) {
                            this.props.routes[i].locations[j] = JSON.parse(this.props.routes[i].locations[j])
                            if (this.props.routes[i].locations[j].location_name != null && this.props.routes[i].locations[j].location_name)
                                area.push({
                                    "label": this.props.routes[i].locations[j].location_name[this.props.lang],
                                    "value": this.props.routes[i].locations[j].location_id,
                                    "children": null
                                })
                        }
                    }
                }

                temp.push({
                    label: route.name,
                    value: route.id,
                    children: area
                })

                area = []
                route = {}
            }

            this.setState({
                data: temp
            })
        }
        if (prevProps.selectedArea != this.props.selectedArea) {
            this.setState({
                value: null
            })
        }
    }


    render() {
        return (
            <div className="example-item">
                <MultiCascader
                    placeholder={<Trans i18nKey={"Area & Route wise selection"} />}
                    data={this.state.data}
                    renderMenu={this.renderMenu}
                    onSelect={this.handleSelect}
                    onChange={this.props.captureChanges}
                    style={{ width: 230 }}
                    menuWidth={230}
                    menuHeight={370}
                    cascade={true}

                />
            </div>
        );
    }
}

export default AsynExampleMultiCascade