pairwise_weight(C,D,G) :- G=#sum{X,C,D,K : votes(X,C,P1,K),votes(X,D,P2,K), P1<P2},candidate(C),candidate(D), C!=D.
pairwise_weight(C,D,A-X) :- pairwise_weight(D,C,X),voters(A), C!=D.
								
arc(A,B,C) :- pairwise_weight(A,B,C),pairwise_weight(B,A,D),C>D.								
arc(B,A,D) :- pairwise_weight(A,B,C),pairwise_weight(B,A,D),C<D.

arc_num(C) :- C =#count{A,B:arc(A,B)}.
ver(C) :- candidate(C).
	
{re_arc(A,B,X):arc(B,A,X),ver(A;B)}H :- arc_num(C),H=C/2.					
kemeny(A,B) :- arc(A,B,X),not re_arc(B,A,X), ver(A;B).				
kemeny(A,B) :- re_arc(A,B,X),ver(A;B). 							
:- kemeny(A,B),kemeny(B,A).											
reach(A,B) :- kemeny(A,B),ver(A;B).								
reach(A,B) :- kemeny(A,C),reach(C,B), ver(A;B;C).					
:- reach(A,A),ver(A).
	
diff(Z) :- Z=#sum{X,A,B:re_arc(A,B,X)}.									
#minimize{Z:diff(Z)}.													
winner(A) :- not reach(_,A),ver(A).									
#show re_arc/3.										
#show winner/1.		