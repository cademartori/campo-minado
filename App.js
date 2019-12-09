import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert
} from 'react-native';
import params from './src/Params'
import MineField from './src/components/MineField'
import { createMinedBoard, cloneBoard, openField, hadExplosion, wonGame, invertFlag, showMines, flagUsed } from './src/Functions'
import Header from './src/components/Header'
import Level from './src/screens/LevelSelection'

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = this.createState()
  }

    minesAmount = () =>{
      const cols = params.getColumnsAmount()
      const rows = params.getRowsAmount()
      return Math.ceil(cols * rows * params.difficultLevel)
    }

    createState = () =>{
      const cols = params.getColumnsAmount()
      const rows = params.getRowsAmount()
      return {
        board: createMinedBoard(rows, cols, this.minesAmount()),
        won: false,
        lost: false,
        showLevelSelection: false,
      }
    }

    onOpenField = (row, column) => {
      const board = cloneBoard(this.state.board)
      openField(board, row, column)
      const lost = hadExplosion(board)
      const won = wonGame(board)
  
      if (lost) {
        showMines(board)
        Alert.alert('Perdeeeeu!', 'Que buuuurro!')
      }
  
      if (won) {
        Alert.alert('Parabéns', 'Você Venceu!')
      }
  
      this.setState({ board, lost, won })
    }

    onSelectField = (row,column) => {
      const board = cloneBoard(this.state.board)
      invertFlag(board,row,column)
      const won = wonGame(board)

      if(won){
        Alert.alert('aaaaa')
      }

      this.setState({board, won})
    }

    onLevelSelected = level => {
      params.difficultLevel = level
      this.setState(this.createState())
    }


  render(){
    return(
      <View style={styles.container}> 
      <Level isVisible={this.state.showLevelSelection} onLevelSelected={this.onLevelSelected} onCancel={() => this.setState({ showLevelSelection:false})} />
      <Header flagsLeft={this.minesAmount() - flagUsed(this.state.board)} onNewGame={() => this.setState(this.createState())}
              onFlagPress={() => this.setState({showLevelSelection: true})} />
        <View style={styles.board}>
            <MineField board={this.state.board} onOpenField={this.onOpenField} onSelectField={this.onSelectField}/>
        </View>
      </View>
    )
  };
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'flex-end',

  },
  board:{
    alignItems: 'center',
    backgroundColor: '#AAA',
  }
});
