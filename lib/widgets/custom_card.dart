import 'package:flutter/material.dart';

class CustomCard extends StatelessWidget {

  final Color firstColor;
  final Color secondColor;
  final String value;
  final String tittle;
  final String subTittle;
  final String text;

  const CustomCard({
    Key key, 
    this.firstColor, 
    this.secondColor, 
    @required this.value, 
    @required this.tittle, 
    @required this.subTittle, 
    @required this.text
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Stack(
          children:<Widget>[
            Container(
              height: 150,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                gradient: LinearGradient(
                  colors: [
                    (firstColor==null)
                    ?Colors.pink
                    :firstColor,
                    (secondColor == null)
                    ?Colors.red
                    :secondColor
                    ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight
                ),
                boxShadow: [
                  BoxShadow(
                    color: (secondColor== null)
                    ?Colors.red
                    :secondColor,
                    blurRadius: 12,
                    offset: Offset(0,6)
                  ),
                ]
              ),
              
            ),
            Positioned.fill(
              child:Row(
                children: <Widget>[
                  
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(left: 20.0),
                      child: Text(
                        (value == "null")
                        ?"....."
                        :value,
                        style: TextStyle(
                          fontSize: 
                          51,color: 
                          Colors.white
                        ),
                      ),
                    )
                  ),
                  Expanded(
                    child:Column(
                      mainAxisSize:MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          tittle,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 26
                          ),
                        ),
                        Text(
                          subTittle,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24
                          ),
                        ),Text(
                          (text=="null")
                          ?"Esperando..."
                          :text,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20
                          ),
                        ),
                      ]
                    )
                  )
                ],
              )
            )
          ] 
        ),
      ),
    );
  }
}