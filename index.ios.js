'use strict';

import React from 'react-native'
import $ from 'cheerio'

const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
} = React;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: '#FF9955',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  listview: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  row: {
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
    flexDirection:'row',
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
  },
  upvotesColumn: {
    width: 36,
    height: 36,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upvotesText: {
    color: '#FF9955',
    fontWeight: 'bold'
  },
  textsColumn: {
    flex: 1,
  },
  rowTitle: {
    fontWeight: 'bold',
    color: '#333'
  },
  rowUrl: {
    fontSize: 10,
    paddingTop: 5,
    color: '#999'
  }
})

const parseHackerNews = (body) => {
  const rows = $(body).find('tr.athing')
  const upvotes = $(body).find('td.subtext span:first-child')
    .map((index, el) => $(el).text().match(/\d+/))

  return rows.map((index, row) => {
    const a = $(row).find('td:last-child > a')
    return {
      title: $(a).text(),
      url: $(a).attr('href'),
      upvote: upvotes[index]
    }
  })
}

class NewsgregatorReact extends React.Component {
  dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
  });

  state = {
    links: this.dataSource.cloneWithRows([])
  };

  constructor (props) {
    super(props)

    fetch('https://news.ycombinator.com/')
      .then((response) => response.text())
      .then((body) => {
        const links = parseHackerNews(body)
        this.setState({ links: this.dataSource.cloneWithRows(links) })
      })
  }

  render () {
    return (
      <View style={ styles.container }>
        <Text style={ styles.title }>Hacker News</Text>

        <ListView
          style={ styles.listview }
          dataSource={ this.state.links }
          renderRow={ (link) =>
            <TouchableHighlight activeOpacity={ 0.5 } underlayColor="#F9F7EE">
              <View style={ styles.row }>
                <View style={ styles.upvotesColumn }>
                  <Text style={ styles.upvotesText }>{ link.upvote }</Text>
                </View>
                <View style={ styles.textsColumn }>
                  <Text numberOfLines={ 1 } style={ styles.rowTitle }>{ link.title }</Text>
                  <Text numberOfLines={ 1 } style={ styles.rowUrl }>{ link.url }</Text>
                </View>
              </View>
            </TouchableHighlight>
          }
        />
      </View>
    )
  }
}

AppRegistry.registerComponent('NewsgregatorReact', () => NewsgregatorReact);
